import { Given, When, Then } from '@cucumber/cucumber'
import { expect, APIResponse, request } from '@playwright/test'
import { apiFixture } from '../../hooks/apiFixture'
import { sharedState } from '../helper/apiSharedState'
const jsonpath = require('jsonpath')
import Ajv from 'ajv'
import path from 'path'

let response: APIResponse
const ajv = new Ajv()
const tempData: Record<string, string | number> = {}

Given('a valid headers with authentication', async function () {
  apiFixture.context = await request.newContext({
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TEST_API_AUTH_TOKEN}`,
    },
  })
})

When('client sends a GET request to {string}', async function (url) {
  if (!url.includes('https')) {
    url = process.env.TEST_API_BASE_URL + url
  }

  try {
    response = await apiFixture.context.get(encodeURI(url))
    sharedState.response.status = response.status()
    sharedState.response.body = await response.text()
    sharedState.response.json = await response.json()
  } catch (e) {
    console.log(e)
  }

})

When('client sends a POST request to {string} with body {string}', async function (url, body) {
  const obj = JSON.parse(body)

  if (!url.includes('https')) {
    url = process.env.TEST_API_BASE_URL + url
  }

  try {
    response = await apiFixture.context.post(encodeURI(url), {
      data: obj,
    })
    sharedState.response.status = response.status()
    sharedState.response.body = await response.text()
  } catch (e) {
    console.log(e)
  }
  console.log(`Response from POST ${url} : ${JSON.stringify(await response.text())}`)
})

Then('response status should be {string}', async function (responseCode) {
  const errorCodes = {
    OK: 200,
    Created: 201,
    Accepted: 202,
    'Not Found': 404,
    'Bad Request': 400,
    Unauthorized: 401,
    'Unprocessable Entity': 422,
    'Internal Server Error': 500,
  }

  const expectedStatusCode = errorCodes[responseCode as keyof typeof errorCodes] || parseInt(responseCode)
  expect(sharedState.response.status).toBe(expectedStatusCode)
})

Then(/^response should (not)?\s?have "([^"]*)"$/, async function (negative, objKey) {
  const responseBody =
    typeof sharedState.response.body === 'string' ? JSON.parse(sharedState.response.body) : sharedState.response.body

  const results = jsonpath.query(responseBody, objKey)
  if (negative) {
    expect(results).toHaveLength(0)
  } else {
    expect(results).not.toHaveLength(0)
  }
})


Then(
  /^response should (not)?\s?have "([^"]*)" (matching|containing) "([^"]*)"$/,
  async function (negative, jsonPath, assertionType, value) {
    const responseBody =
      typeof sharedState.response.body === 'string' ? JSON.parse(sharedState.response.body) : sharedState.response.body
    const results = jsonpath.query(responseBody, jsonPath)
    let actualValue = results.length === 1 ? results[0] : results

    // Convert actualValue to string if the expected value is a string and actualValue is not an array
    if (typeof value === 'string' && !Array.isArray(actualValue)) {
      actualValue = String(actualValue)
    }

    const expectMethod = assertionType === 'matching' ? 'toEqual' : 'toContain'

    if (negative) {
      expect(actualValue).not[expectMethod](value)
    } else {
      expect(actualValue)[expectMethod](value)
    }
  }
)

Then(/^response json should match with json schema "([^"]*)"$/, async function (jsonSchemaPath) {
  const schemaFilePath = path.resolve(__dirname, `../json_schema/${jsonSchemaPath}.schema.json`);
  const schema = require(schemaFilePath);

  const validate = ajv.compile(schema);
  const valid = validate(sharedState.response.json);

  expect(valid).toBe(true);
})

Given('client sets the value of {string} as {string} on body parameter', async function (key, value) {
  if (Object.prototype.hasOwnProperty.call(sharedState.requestData.body, key)) {
    if (typeof sharedState.requestData.body[key] === 'number') {
      sharedState.requestData.body[key] = isNumericString(value) ? Number(value) : value
    } else {
      sharedState.requestData.body[key] = value
    }
  } else {
    throw new Error(`Key ${key} is not found`)
  }
})

When('client collects data {string} from body parameters', async function (key) {
  if (Object.prototype.hasOwnProperty.call(sharedState.requestData.body, key)) {
    tempData[key] = sharedState.requestData.body[key]
  }
})

When('client place an order with path ID {string}', async function (petID) {
  const url = `${process.env.TEST_API_BASE_URL}/store/order`
  const randomOrderId = `automation-${Math.floor(Math.random() * 9000000000) + 1000000000}`

  try {
    response = await apiFixture.context.post(encodeURI(url), {
      data: {
        "id": randomOrderId,
        "petId": petID,
        "quantity": 0,
        "shipDate": `${new Date().toISOString()}`,
        "status": "placed",
        "complete": true
      },
    })
    sharedState.response.status = response.status()
    sharedState.response.body = await response.text()
  } catch (e) {
    console.log(e)
  }
})

When('client update the Pet information for pet ID {string}', async function (petID) {
  const url = `${process.env.TEST_API_BASE_URL}/pet`
  const randomOrderId = `automation-${Math.floor(Math.random() * 9000000000) + 1000000000}`

  try {
    response = await apiFixture.context.put(encodeURI(url), {
      data: {
        "id": petID,
        "category": {
          "id": 0,
          "name": "Pomeranian"
        },
        "name": "kurikuri",
        "photoUrls": [
          "https://picsum.photos/200/300"
        ],
        "tags": [
          {
            "id": 0,
            "name": "Super Cute"
          }
        ],
        "status": "available"
      },
    })
    sharedState.response.status = response.status()
    sharedState.response.body = await response.text()
  } catch (e) {
    console.log(e)
  }
})



function isNumericString(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(Number(value))
}
