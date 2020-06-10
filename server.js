const axios = require("axios");
const Koa = require("koa");

const app = new Koa();
const API_PREFIX = "/api/3.4";
const PORT = 1337;

let TOKEN, SITE_ID, SERVER;
app.use(require("@koa/cors")());
app.use(require("koa-body")());
app.use(async ctx => {
  const isLoginRequest = ctx.path.includes("signin");
  let body;
  try {
    if (!TOKEN || isLoginRequest) {
      const { server, user, password, site } = ctx.request.body;
      SERVER = server;
      const {
        data: { credentials }
      } = await axios.post(
        `${server}${API_PREFIX}/auth/signin`,
        `<tsRequest>
            <credentials name="${user}" password="${password}">
                <site contentUrl="${site}" />
            </credentials>
       </tsRequest>`,
        {
          headers: {
            "Content-Type": "text/xml"
          }
        }
      );
      console.log("Credentials acquired:", credentials);
      SITE_ID = credentials.site.id;
      TOKEN = body = credentials.token;
    }
    if (!isLoginRequest) {
      console.log(
        `requesting ${SERVER}${API_PREFIX}${ctx.path.replace(
          "_siteId_",
          SITE_ID
        )}`
      );
      const { data } = await axios.get(
        `${SERVER}${API_PREFIX}${ctx.path.replace("_siteId_", SITE_ID)}`,
        {
          headers: {
            "X-Tableau-Auth": TOKEN
          }
        }
      );
      console.log(data);
      body = data;
    }
    ctx.body = body;
  } catch (e) {
    const { data, status } = e.response;
    console.error(data.error);
    ctx.status = status;
    ctx.body = data.error;
  }
});

app.listen(PORT);
console.log(`Listening to port ${PORT}`);
