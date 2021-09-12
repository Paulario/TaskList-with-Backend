In order to run this app, install live-server and json-server with npm:

```
npm install -g live-server json-server
```

After that clone the repository: 

```
git clone https://github.com/Paulario/TaskList-with-Backend
```

cd into it:

```
cd TaskList-with-Backend
```

and, finally, start the app by running these two processes in the command line:

```
json-server --watch db.json

live-server --ignore=db.json
```

If the app refreshes on each update of **db.json**, then run this
instead of the second command:

```
live-server --watch=index.html
```

