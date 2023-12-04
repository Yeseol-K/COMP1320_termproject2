const fs = require("fs");
const { readFile } = require("fs/promises");
const { DEFAULT_HEADER } = require("./util/util");
const path = require("path");
var qs = require("querystring");
const ejs = require('ejs');
const {formidable} = require('formidable');

const controller = {
  getFormPage: async (request, response) => {
  const database = await readFile("database/data.json", "utf8");
  const arr = JSON.parse(database);
  const data = {
    users: arr
  }

    const folderPath = path.join(__dirname, "..", "src", "views", "profile.ejs");
    console.log(folderPath)
    ejs.renderFile(folderPath, data, {}, function(err, newHtml) {
    response.writeHead(200, DEFAULT_HEADER);
    response.end(newHtml);
    });
    },
  getFeed: async (request, response) => {
    // username is the user from the url
    const username = (request.url.split("?")[1]).split("=")[1]; // sandra123

    // These two steps are getting array from data.json
    const database = await readFile("database/data.json");
    const arr = JSON.parse(database);

    const foundUser = arr.find(user => user.username === username)
    
    const folderPath = path.join(__dirname, "..", "src", "views", "feed.ejs");
    const data = {
        username: foundUser.username,
        followers: foundUser.stats.followers,
        following: foundUser.stats.following,
        posts: foundUser.stats.posts,
        feedPhotos: foundUser.photos,
        profile: foundUser.profile,
        describe: foundUser.description
    }
    ejs.renderFile(folderPath, data, {}, function(err, newHtml){
        response.end(newHtml);
    });
  },
  sendFormData: async (request,response) => {
    const username = (request.url.split("?")[1]).split("=")[1]; //john123
      fs.readFile("database/data.json","utf8", (err,data) => {
        if(err) {
          console.error(err);
        }
        const objData = JSON.parse(data);
      })
  },
  uploadImages: async (request, response) => {
    const username = (request.url.split("?")[1]).split("=")[1]; 
    const form = formidable({keepExtensions: true});
    form.uploadDir = path.join(__dirname, "..", "src", "photos", username);
    let fields;
    let files;
    [fields, files] = await form.parse(request);
    // MOVE THE FILE HERE
    console.log(fields)
    console.log(files);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ fields, files }, null, 2));
    return;
  },

};
module.exports = controller;
