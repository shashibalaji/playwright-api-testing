import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { APILogger } from "../utils/logger";
import articleRequestPayload from '../request-objects/POST-article.json'
//import { faker } from '@faker-js/faker';

// let authToken: string;
// test.beforeAll("Get Token", async ({config }) => {
//   authToken = await createToken(config.userEmail,config.userPassword)
//   console.log(`Token -----> ${authToken}`);
// });

test('logger',()=>{
  const logger = new APILogger()
  logger.logRequest('GET',"https://test.com/api",{Authorization:'token'},{foo:'bar'})
  logger.logResponse(200, {foo:'bar'})
  const logs = logger.getRecentLogs()
  console.log(logs);
  
})

test("Get Articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0})

    .getRequest(200);

  await expect(response).shouldMatchSchema('articles','GET_articles')

  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  //expect(response.articlesCount).toBe(10); //shouldEqual
  expect(response.articlesCount).shouldEqual(12)

  const response2 = await api.path("/tags").getRequest(200);

  expect(response2.tags[0]).shouldEqual("Test");
  expect(response2.tags.length).shouldBeLessThanOrEqual(12);
});

test("Get Test Tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(207);
  await expect(response).shouldMatchSchema('tags','GET_tags', true)
  //await validateSchema('tags','GET_tags',response)
  expect(response.tags[0]).shouldEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test.only('Create and Delete Article',async({api})=>{
  //const articleTitle = faker.lorem.sentence(5)
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
  articleRequest.article.title ='Test API 1'
  const createArticleResponse = await api
    .path('/articles')
    //.headers({Authorization: authToken})
    .body(articleRequest)
    .postRequest(201)
  await expect(createArticleResponse).shouldMatchSchema('articles','POST_articles')
  expect(createArticleResponse.article.title).shouldEqual('Test API 1')
  const slugId = createArticleResponse.article.slug

  const response = await api
    .path("/articles")
    //.headers({Authorization: authToken})
    .params({ limit: 10, offset: 0})
    .getRequest(200);

  expect(response.articles[0].title).shouldEqual('Test API 1')

  await api
      .path(`/articles/${slugId}`)
      //.headers({Authorization: authToken})
      .deleteRequest(204)

  const responseTwo = await api
    .path("/articles")
    //.headers({Authorization: authToken})
    .params({ limit: 10, offset: 0})
    .getRequest(200);

  expect(responseTwo.articles[0].title).not.shouldEqual('Test API 1')
})

test('Create, Update and Delete Article',async({api})=>{
  const createArticleResponse = await api
    .path('/articles')
   
    .body({article: {title: "Test API 1",description: "Test API 1",body: "API testing 1",tagList: [],},})
    .postRequest(201)
  
  expect(createArticleResponse.article.title).shouldEqual('Test API 1')
  const slugId = createArticleResponse.article.slug

  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
   
    .body({article: {title: "Test API 2",description: "Test API 2",body: "API testing 2",tagList: [],},})
    .putRequest(200)
  expect(await updateArticleResponse.article.title).shouldEqual('Test API 2')
  const updatedSlugId = updateArticleResponse.article.slug


  const updatedResponse = await api
    .path("/articles")
  
    .params({ limit: 10, offset: 0})
    .getRequest(200);

  expect(updatedResponse.articles[0].title).shouldEqual('Test API 2')

  await api
      .path(`/articles/${updatedSlugId}`)
      
      .deleteRequest(204)

  const responseTwo = await api
    .path("/articles")
  
    .params({ limit: 10, offset: 0})
    .getRequest(200);

  expect(responseTwo.articles[0].title).not.shouldEqual('Test API 2')
})
