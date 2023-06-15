const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");

let db = null;

const dbPath = path.join(__dirname, "todoApplication.db");

//////////////
const listenAndinitializeDb = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server is running at  : http://localhost:3000/");
    });
  } catch (err) {
    console.log(`DB Error :${err.message}`);
    process.exit(1);
  }
};
listenAndinitializeDb();
////////////

// GET 1

app.get("/todos/", async (request, response) => {
  const { status = "", priority = "", search_q = "" } = request.query;
  const getPlayersSqlcode = `
    SELECT *
    FROM  todo
    WHERE status LIKE "%${status}%" AND priority LIKE "%${priority}%"
    AND todo LIKE "%${search_q}%"
    ORDER BY id;
   `;
  const finalOutputArray = await db.all(getPlayersSqlcode);

  response.send(finalOutputArray);
});

// GET 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  //   const { status, priority = "", search_q = "" } = request.query;
  const getPlayersSqlcode = `
    SELECT *
    FROM  todo
    WHERE id = ${todoId} ;
   `;
  const finalOutputArray = await db.get(getPlayersSqlcode);

  response.send(finalOutputArray);
});

//  POST 3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const query = `
     INSERT INTO todo(id,todo,priority,status)
     VALUES (
         '${id}',
         '${todo}',
         '${priority}',
         '${status}'
     );
    `;
  const responseDb = await db.run(query);
  response.send("Todo Successfully Added");
});

// PUT 4

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const unknownBody = request.body;
  const { status, priority, todo } = unknownBody; // dont know which reques is given so
  let knowColumn = ""; //other will be undefined  in that case
  let responseDb;
  switch (true) {
    case status !== undefined:
      knowColumn = "status";
      //queryF(knowColumn)
      responseDb = await db.run(queryF(knowColumn, status));
      response.send("Status Updated");
      break;
    case priority !== undefined:
      knowColumn = "priority";
      //queryF(knowColumn)
      responseDb = await db.run(queryF(knowColumn, priority));
      response.send("Priority Updated");
      break;
    case todo !== undefined:
      knowColumn = "todo";
      //queryF(knowColumn)
      responseDb = await db.run(queryF(knowColumn, todo));
      response.send("Todo Updated");
      break;

    // default:
    //   break;
  }
  function queryF(col, value) {
    const query = `UPDATE todo
                     SET 
                        ${col} = "${value}"
                       WHERE id = ${todoId} ;
                      `;
    return query;
  }
});

// DELETE 5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const query = `
    DELETE FROM
        todo
    WHERE
      id = '${todoId}'
    ;
   `;
  const responseDb = await db.run(query);
  response.send("Todo Deleted");
});

module.exports = listenAndinitializeDb;
module.exports = app;
