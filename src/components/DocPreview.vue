<template>
  <div class="editor-container">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div>
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
    <div class="view-container">
      <div class="view" id="data"></div>
    </div>
  </div>
</template>

<script>
import { getDoc } from "../apollo/queries";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "DocPreview",
  data() {
    return {
      previewContent: "",
      isLoading: true,
      fullPage: true,
      id: this.$route.params.id,
      title: ""
    };
  },
  components: {
    Loading
  },
  created: function() {
    this.$apollo
      .query({
        query: getDoc(this.$route.params.id, "PREVIEW")
      })
      .then(data => {
        let element = document.getElementById("data");
        this.previewContent = data.data.getDoc.content;
        element.innerHTML = this.previewContent;
        this.isLoading = false;
        this.title = data.data.getDoc.title;
        console.log(data.data.getDoc);

        let eles = document.getElementsByClassName("preview-button");
        for (let i = 0; i < eles.length; i++) {
          eles[i].style.padding = "10px 30px";
          eles[i].style.backgroundColor = "#0055ba";
          eles[i].style.borderRadius = "5px";
          eles[i].style.color = "#ffffff";
          eles[i].style.margin = "5px";
        }
      });
  }
};
</script>

<style scoped>
@import "../assets/css/trix.css";
.editor-container {
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
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25);
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

.view-container {
  max-width: 100%;
  height: auto;
}

.view {
  border: 1px solid #bbb;
  border-radius: 3px;
  margin: 0;
  padding: 0.4em 0.6em;
  min-height: 5em;
  height: 100vh;
  width: 75%;
  margin: auto;
  background-color: #ffffff;
  margin-top: 5%;
}
</style>
