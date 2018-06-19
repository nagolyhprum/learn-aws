import $ from "jquery";

$(() => {  

  const createPresignedPost = () => fetch("/graphql", {
    headers : {
      "Content-Type" : "application/json; charset=utf-8"
    },
    method : "POST",
    body : JSON.stringify({
      query : `
  query($key: String!, $bucket: String!) {
    s3 {
      createPresignedPost(Key: $key, Bucket: $bucket) {
        url
        fields {
          bucket
          XAmzAlgorithm
          XAmzCredential
          XAmzDate
          Policy
          XAmzSignature
        }
      }
    }
  }        
      `,
      variables : {
        bucket : "my.bucket",
        key : "my.post"
      }
    })
  }).then(res => res.json()).then(json => json.data.s3.createPresignedPost);

  const uploadFile = (file, url, headers) => fetch(url, {
    body : file,
    headers,
    method : "PUT"
  })

  $("#createPresignedPost").each((i, e) => {
    const $createPresignedPost = $(e);
    $createPresignedPost.submit(e => {
      e.preventDefault();   
      const file = $createPresignedPost.find(".file")[0].files[0];
      createPresignedPost().then(({ url, fields }) => {
        const headers = {
          Key : "my.post"
        };
        Object.keys(fields).forEach(key => {
          headers[key.replace(/(.)([A-Z])/g, "$1-$2")] = fields[key];
        });
        console.log(headers);
        uploadFile(file, url, headers);
      });
    });
  });

});