This is the repository that hosts the refactoring of MICADO identity solution


### Development execution
In development to execute one of the services

``
(set -a; source prod.env; set +a; docker-compose up keycloak)

``


### Execution
To ensure the database is setup correctly, create a prod.env file with this content:

```
POSTGRES_PASSWORD=secretpassword1
KEYCLOAK_PASSWORD=secretpassword2
GITEA_DB_PWD=secretpassword3
MICADO_DB_PWD=secretpassword4
KEYCLOAK_DB_PWD=secretpassword5
WEBLATE_POSTGRES_PASSWORD=secretpassword6
RASA_DB_PASSWORD=secretpassword7

```

