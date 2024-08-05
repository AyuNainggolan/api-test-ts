import { BeforeAll } from '@cucumber/cucumber'
import * as dotenv from 'dotenv'
const fs = require('fs')

BeforeAll(async function () {
  dotenv.config({
    path: `.env`,
  })
})
