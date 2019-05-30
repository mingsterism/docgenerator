import { gql } from "apollo-boost";

export const saveDoc = (id, title, content, docType) => {
  let str = ` mutation {
     saveDoc(
       input: {
         title: "${title}"
         docType: ${docType}
         content: "${content}"
         docID: "${id}"
       }
     ) {
       isModified
       modifiedID
       error
     }
   }`;
  return gql(str);
};

export const getDoc = (id, doctype) => {
  let str = ` query {
    getDoc(id: "${id}", docType: ${doctype}) {
      _id
      title
      content
    }
  }`;
  return gql(str);
};
