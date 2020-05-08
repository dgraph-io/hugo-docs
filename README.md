# Dgraph doc theme.

The theme for Dgraph documentation built with [hugo](https://gohugo.io/).


# Add a Nested Page to a topic.

1. You have to edit config.toml

It needs a "parent" and a "weight" (to have a order). Also the identifier needs to be unique.

```
[[menu.main]]
  name = "Expanding Graph Edges"
  url = "/query-language/expanding-graph-edges/"
  identifier = "expanding-graph-edges"
  parent = "query-language"
  weight = 1
```

2. Now you have to create it correspondent path.

Create a directory below the parent
`mkdir dgraph/wiki/query-language/expanding-graph-edges`

and create two files at `./query-language/expanding-graph-edges`

```
index.md # This will go the actual content.
_index.md # This is necessary due some internal thing in Hugo.
```

3. Finaly, you have to add the header of the `index.md` content.

The parent needs a param called "root = true" and the nested needs the param "child = true".

#### This is the header of the parent
```
+++
title = "Query Language"
root = true #mandatory
+++
```

#### This is the header of the "child/nested"
```
+++
title = "Expanding Graph Edges"
child = true #mandatory
+++
```
