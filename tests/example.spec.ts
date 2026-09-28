import { test, expect } from "@playwright/test";
let authToken: string
test.beforeAll('run before all ',async ({request})=>{
    const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: {
          email: "abhirambalajinithya@gmail.com",
          password: "welcome123",
        },
      },
    },
  );

    const {
    user: { token },
  } = await tokenResponse.json();
  authToken = token
})


test.only("Get Test Tags", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags",
  );
  const tagsResopnseJSON = await tagsResponse.json();
  //const tagsResponseBody = await tagsResponse.body()
  // console.log(tagsResponse);
  //console.log(tagsResopnseJSON);
  // console.log(tagsResponseBody);
  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResopnseJSON.tags[0]).toEqual("Test");
  expect(tagsResopnseJSON.tags.length).toBeLessThanOrEqual(10);
});

test("Get All Articles", async ({ request }) => {
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
  );
  expect(articlesResponse.status()).toEqual(200);

  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toBe(10);
  //console.log(articlesResponseJSON);
});

test("Create and Delete Article", async ({ request }) => {
  // const tokenResponse = await request.post(
  //   "https://conduit-api.bondaracademy.com/api/users/login",
  //   {
  //     data: {
  //       user: {
  //         email: "abhirambalajinithya@gmail.com",
  //         password: "welcome123",
  //       },
  //     },
  //   },
  // );

  // // const tokenResponseJSON = (await loginResponse.json()).user.token;
  // // console.log(loginResponseJSON);

  // //console.log(createLoginResponse);
  // //console.log(loginResponseJSON.user.token);

  // const {
  //   user: { token },
  // } = await tokenResponse.json();
  //console.log(token);

  const newArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Test API 1",
          description: "Test API 1",
          body: "API testing 1",
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );
  expect(newArticleResponse.status()).toEqual(201);
  //console.log(await newArticleResponse.json());
  const {
    article: { title },
  } = await newArticleResponse.json();
  expect(title).toEqual("Test API 1");

  const {article:{slug}} = await newArticleResponse.json();

  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",{
      headers:{
        Authorization:`Token ${authToken}`
      }
    }
  );
  expect(articlesResponse.status()).toEqual(200);

  const articlesResponseJSON = await articlesResponse.json();
  expect(await articlesResponseJSON.articles[0].title).toEqual('Test API 1')


  //Delete

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug}`,{
    headers:{
      Authorization:`Token ${authToken}`
    }
  })
  expect(deleteArticleResponse.status()).toEqual(204)
});

test("Create and Update Article", async ({ request }) => {
  // const tokenResponse = await request.post(
  //   "https://conduit-api.bondaracademy.com/api/users/login",
  //   {
  //     data: {
  //       user: {
  //         email: "abhirambalajinithya@gmail.com",
  //         password: "welcome123",
  //       },
  //     },
  //   },
  // );

  // const {
  //   user: { token },
  // } = await tokenResponse.json();
  // //console.log(token);

  const newArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Test API 1",
          description: "Test API 1",
          body: "API testing 1",
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );
  expect(newArticleResponse.status()).toEqual(201);
  //console.log(await newArticleResponse.json());

  const {
    article: { title },
  } = await newArticleResponse.json();
  expect(title).toEqual("Test API 1");

  const {article:{slug}} = await newArticleResponse.json();

  //Update
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slug}`,{
    data: {
        article: {
          title: "Test API 2",
          description: "Test API 2",
          body: "API testing 2",
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${authToken}`,
      },
  })
  expect(updateArticleResponse.status()).toEqual(200)

  const updateArticleResponseJSON = await updateArticleResponse.json()
  expect(updateArticleResponseJSON.article.title).toEqual('Test API 2')
  const newSlugId= await updateArticleResponseJSON.article.slug

  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",{
      headers:{
        Authorization:`Token ${authToken}`
      }
    }
  );
  expect(articlesResponse.status()).toEqual(200);

  const articlesResponseJSON = await articlesResponse.json();
  expect(await articlesResponseJSON.articles[0].title).toEqual('Test API 2')


  //Delete

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`,{
    headers:{
      Authorization:`Token ${authToken}`
    }
  })
  expect(deleteArticleResponse.status()).toEqual(204)
});
