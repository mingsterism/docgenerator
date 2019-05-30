<template>
  <div class="trix-editor-container">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div class="navigation">
      <div class="navbar">
        <div class="div1">
          <div>
            <div class="logo-container">
              <v-icon medium color="#ffffff">insert_drive_file</v-icon>
            </div>
          </div>
          <div class="div1-col2">
            <div>
              <input v-model="title" placeholder="Untitled Doc Template" class="title-input">
            </div>
            <div class="buttons-container">
              <button class="function-button">File</button>
              <button class="function-button">View</button>
              <button class="function-button">Help</button>
            </div>
          </div>
        </div>
        <div class="div2">
          <div></div>
          <div class="div2-sub">
            <div class="link-container">
              <router-link :to="`/preview/${id}`" target="_blank" title="Preview the document">
                <v-icon medium>remove_red_eye</v-icon>
              </router-link>
            </div>
            <div class="link-container">
              <router-link
                :to="`/publish/${id}`"
                target="_blank"
                class="publish-button"
                title="Publish the document"
              >Publish</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VueTrix v-model="editorContent"/>
  </div>
</template>

<script>
import VueTrix from "vue-trix";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { saveDoc, getDoc } from "../apollo/queries";
export default {
  name: "DocGenerator",
  data() {
    return {
      editorContent: "",
      previewContent: "",
      jsonContent: "",
      id: this.$route.params.id,
      title: "",
      isLoading: true,
      fullPage: true
    };
  },
  created() {
    this.$apollo
      .query({
        query: getDoc(this.$route.params.id, "EDIT")
      })
      .then(data => {
        var element = document.querySelector("trix-editor");
        element.editor.insertHTML(data.data.getDoc.content);
        this.isLoading = false;
        this.title = data.data.getDoc.title;
      })
      .catch(err => {
        console.log("err", err);
      });
  },
  methods: {
    updateEditorContent() {
      var element = document.querySelector("trix-editor");
      element.addEventListener("trix-change", () => {
        let modifiedString = element.value;
        let originalString = element.value;
        let currentState = JSON.stringify(element.editor);
        let currentText = JSON.parse(currentState).document[0].text[0].string;
        let matches = currentText.match(/\[.*?\]/g);
        let allVariables = [];
        if (matches && matches.length > 0) {
          for (let i = 0; i < matches.length; i++) {
            let result = matches[i].substring(1, matches[i].length - 1);
            allVariables.push(result);
          }
          for (let i = 0; i < matches.length; i++) {
            modifiedString = modifiedString.replace(
              "[" + allVariables[i] + "]",
              `<button id="${
                allVariables[i]
              }" class="preview-button" onclick="alert('${allVariables[i]}')">${
                allVariables[i]
              }</button>`
            );
          }
        }
        this.previewContent = modifiedString;
        this.nonJsonContent = originalString;
        this.currentState = currentState;
        this.saveEditDataToDb();
      });
    },
    savePreviewDataToDb() {
      this.$apollo
        .mutate({
          mutation: saveDoc(
            this.id,
            this.title,
            this.previewContent.replace(/\"/g, '\\"'),
            "PREVIEW"
          )
        })
        .then(() => {
          this.publishTemplate();
        })
        .catch(error => {
          console.error(error);
        });
    },
    saveEditDataToDb() {
      // var myJSONString = JSON.stringify(this.currentState, null, 2);
      // var myEscapedJSONString = JSON.stringify(myJSONString).slice(1, -1);
      // console.log(myEscapedJSONString);
      this.$apollo
        .mutate({
          mutation: saveDoc(this.id, this.title, this.nonJsonContent, "EDIT")
        })
        .then(() => {
          this.savePreviewDataToDb();
        })
        .catch(error => {
          console.error(error);
        });
    },
    publishTemplate() {
      this.$apollo
        .mutate({
          mutation: saveDoc(this.id, this.title, this.nonJsonContent, "LIVE")
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  watch: {
    editorContent: {
      handler: "updateEditorContent"
    },
    title: {
      handler: "saveEditDataToDb"
    }
  }
};
</script>

<style scoped>
@import "../assets/css/trix.css";
.trix-editor-container {
  height: 100%;
}
.div1 {
  align-items: center;
  justify-content: center;
  display: flex;
}

.div1-col2 {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
}

.navbar {
  height: 75px;
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  grid-template-rows: 1fr;
  grid-template-areas: ". . . .";
}

.div2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: ". . . .";
}

.div2-sub {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container {
  background: linear-gradient(180deg, #2f80ed 0%, #0055ba 100%);
  border-radius: 25px;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  display: flex;
}

.title-input {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  display: flex;
  align-items: center;
  color: #666666;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  padding-top: 5px;
}

.function-button {
  padding: 5px;
}

a {
  text-decoration: none;
  color: #ffffff;
}

.publish-button {
  padding: 10px 20px;
  background-color: #0055ba;
  border-radius: 5px;
}

.link-container {
  padding: 10px;
  margin: 10px;
}
</style>

