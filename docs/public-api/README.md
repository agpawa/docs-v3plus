---
title: Public API
---

## Portal Identification

Every API request made from a published portal will include an "X-Portal-Token" header, that will pass a unique portal token along with the request. The portal token will be used to identify which portal the request is associated with.

```http
GET /api/v1/conferences HTTP/1.1
X-Portal-Token: M!nb&KypG1o$NP1eoig%rkaykZkZ$tUiQ*0T
```

---

## Field filtering & sorting

### Filtering

All collection API's allow for filtering of the results on most of the resource's available fields.

**Return all conferences with a status of "live" or "archive**  

```http
GET /api/v1/conferences?filters[state]=live,archive HTTP/1.1
``` 

### Sorting 

All collection API's allow for sorting on most of the resource's available fields.

**Return conferences sorted by start_date, in ascending order**  
```http
GET /api/v1/conferences?orderBy=start_date&orderDir=asc HTTP/1.1
``` 

### Specific fields

All resource & collection API's allow you to request the specific fields you want returned.

**Return a conference with only the name, description & start_date fields**  
```http
GET /api/v1/conferences/1?fields=name,description,start_date HTTP/1.1
``` 

### Sub-resources

Most resource API's allow access to certain sub-resources. This allows you to request for those sub-resource relationships to be returned in the API response.

**Return a conference with related sponsors & presenters.**  
```http
GET /api/v1/conferences/1?with=sponsors,presenters HTTP/1.1
``` 

**Return a conference with nested sub-resources of days, tracks, presentations. Relationship hierarchy will be maintained.**  
```http
GET /api/v1/conferences/1?with=days.tracks.presentations HTTP/1.1
``` 

> The dot notation in `days.tracks.presentations` indicates sub-resources of sub-resources, so you are able to chain together a specific hierarchy if supported by the API.

:::tip
Sub-resources are **only available** on individual resource API requests (e.g. `/api/v1/conferences/1`).  
Sub-resources are **not available**  on API requests to resource collections (e.g. `/api/v1/conferences`).
:::

### Paginating

All stand alone collection API's allow for paginating of the results.   
  

Collection API's that are sub-resources (e.g. `/api/v1/conferences/1/presenters`) will always return the full, non-paginated collection.

**Return a paginated collection of conferences, with 5 results per page**
```http
GET /api/v1/conferences?pageSize=5 HTTP/1.1
``` 

> **Note:** In paginated results, additional `links` and `meta` keys will be delivered with the payload as follows:

```json
"data": {
   ...
},
"links":{
    "first": "https://v3plusportal.com/api/v1/conferences?page=1",
    "last": "https://v3plusportal.com/api/v1/conferences?page=1",
    "prev": null,
    "next": null
},
"meta":{
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "path": "http://v3plusportal.com/api/v1/conferences",
    "per_page": 15,
    "to": 10,
    "total": 10
}
```

---

## API Endpoints

### Auth

::: tip
These Auth routes are compatible with conference & bootcamp portal authentication. Townhall authentication behaves differently, in that it captures registration & user authorization in one step. For Townhall authentication, please see [Townhall Auth](#townhall-auth) below.
:::

**User Log-in**

```http
POST /api/v1/auth HTTP/1.1
X-Portal-Token: M!nb&KypG1o$NP1eoig%rkaykZkZ$tUiQ*0T

{
    "email": "bob@company.com",
    "password": "iLoveCats"
}
```

> Returns a `HTTP 201` status code, and a payload, including user info for use in the template context, and a JSON Web Token for authenticating requests through  the API

**API Response**
```json
{
    "token": "z6eWaDASp7WX1z7ls9cjyPKmNiYpMEDye1f0f4xp",
    "role": "user",
    "name": "Bob Smith",
    "email": "bob@company.com"
}
```

> **Note:** Once the token is obtained, it needs to be passed as a query parameter with every subsequent API request. e.g. `GET /api/v1/presentations?token=z6eWaDASp7WX1z7ls9cjyPKmNiYpMEDye1f0f4xp`


**User Log-out**

```http
DELETE /api/v1/auth?token=z6eWaDASp7WX1z7ls9cjyPKmNiYpMEDye1f0f4xp HTTP/1.1
```

>The log-out API call will return an `HTTP 204` status code, and clear any server side references to the user & token. Additionally, any client side references to the user information and token (e.g. cookies, localStorage, etc.) should also be removed.

### Registration Form

>The registration form resource is different from other API resources in that you can not filter, sort or request specific fields. Every time a registration form resource is requested, the entire payload for a single registration form is returned.

**Get Group Registration Form**

```http
GET /api/v1/groups/1/registration_form HTTP/1.1
```

**Get Townhall Registration Form**

```http
GET /api/v1/townhalls/1/registration_form HTTP/1.1
```

**API Response**
```json
{
    "id": 5,
    "name": "Sample Registration Form",
    "description": "Registration form description here....",
    "fields": [
        {
            "name": "first_name",
            "label": "First Name",
            "placeholder": "First",
            "type": "text",
            "validation": {  
                "required": true
            },
            "options": [],
            "order": 1
        },
        {
            "name": "last_name",
            "label": "Last Name",
            "placeholder": "Last",
            "type": "text",
            "validation": {  
                "required": true
            },
            "options": [],
            "order": 2
        },
        {
            "name": "email",
            "label": "Email",
            "placeholder": "you@company.com",
            "type": "text",
            "validation": {  
                "required": true,
                "email": true,
            },
            "options": [],
            "order": 3
        },
        {
            "name": "password",
            "label": "Password",
            "placeholder": null,
            "type": "password",
            "validation": {  
                "required": true
            },
            "options": [],
            "order": 4
        },
        {
            "name": "field_10",
            "label": "What is your favorite color?",
            "placeholder": null,
            "type": "select",
            "validation": {  
                "required": true
            },
            "options": [
                {"name": "Select an option", "value": null},
                {"name": "Red", "value": "red"},
                {"name": "Blue", "value": "blue"},
                {"name": "Green", "value": "green"},
                {"name": "Other", "value": "other"}
            ],
            "order": 5
        },
    ]
}
```

::: tip  
If the resource being registered into (e.g. Group) has a price greater than $0, the registration form API will also include the required payment fields in the response payload
:::  

**API Response (incl. payment fields)**

```json
{
    ...
    "fields": [
        ...
        {
            "name": "cc_number",
            "label": "Card Number",
            "placeholder": null,
            "type": "text",
            "validation": {  
                "required": true
            },
            "options": [],
            "order": 6
        },
        {
            "name": "cc_exp_month",
            "label": "Exp. Month",
            "placeholder": null,
            "type": "text",
            "validation": {  
                "required": true
            },
            "options": [],
            "order": 7
        },
        {
            "name": "cc_exp_year",
            "label": "Exp. Year",
            "placeholder": null,
            "type": "text",
            "validation": {  
                "required": true
            },
            "options": [],
            "order": 8
        },
        {
            "name": "cc_cvc",
            "label": "CVC/CVV",
            "placeholder": null,
            "type": "text",
            "validation": {  
                "required": true
            },
            "options": [],
            "order": 9
        }
    ]
```

:::tip
Since the payment field names are unique, and prefixed with `cc_`, the templates **should** contain their own logic to lay these credit card input blocks out in a more deliberate fashion. This is so the input blocks for payments don't have to rely on the generic form layout logic, which would, presumably, just list each field out in a row.
:::

### Registration

**Register into a group**

```http
POST /api/v1/groups/1/registration HTTP/1.1
X-Portal-Token: M!nb&KypG1o$NP1eoig%rkaykZkZ$tUiQ*0T

{
    "first_name": "Bob",
    "last_name": "Smith",
    "email": "bob@company.com",
    "password": "iLoveCats",
    "field_10": "Answer for custom field here"
}
```

::: tip  
All registration form fields will be validated based on the validation rules configured in the Registration Form Admin (`Edit Registration Form > Form Fields`).  
:::  

**Register into a group (incl. payment)**

```http
POST /api/v1/groups/1/registration HTTP/1.1
X-Portal-Token: M!nb&KypG1o$NP1eoig%rkaykZkZ$tUiQ*0T

{
    "first_name": "Bob",
    "last_name": "Smith",
    "email": "bob@company.com",
    "password": "iLoveCats",
    "field_10": "Answer for custom field here",
    "cc_number": "4242424242424242",
    "cc_exp_month": "5",
    "cc_exp_year": "2025",
    "cc_cvc": "123"
}
```

:::warning INFO  
Credit card fields will first be validated for format by V3Plus, then further validated by Stripe during the payment processing flow.
:::  


### Portals

**Get single portal resource**
```http
GET /api/v1/portals/1 HTTP/1.1
``` 

**Fields**
- client_id
- name
- description
- domain
- favicon
- social_title
- social_description
- social_photo

**Sub-resources**
- template
- conferences
- townhalls
- pages
- registration_forms

### Groups

**Get group collection**
```http
GET /api/v1/groups/ HTTP/1.1
```

**Get group collection in conference**
```http
GET /api/v1/conferences/1/groups HTTP/1.1
```

**Get single group resource**
```http
GET /api/v1/groups/1 HTTP/1.1
```

**Fields**
- registration_form_id
- name
- description
- price
- code

**Sub-resources**
- registration_form


### Conferences

**Get conference collection**
```http
GET /api/v1/conferences HTTP/1.1
```

**Get single conference resource**
```http
GET /api/v1/conferences/1 HTTP/1.1
``` 

**Fields**
- portal_id
- name
- description
- photo
- photo_large
- state *(live, archive, staging)*
- timezone
- start_date
- end_date

**Sub-resources**
- days.tracks.presentations.presenters
- presenters
- keynotes
- cochairs
- sponsors
- exhibitors

### Presentations

**Get presentation collection in conference**
```http
GET /api/v1/conferences/1/presentations HTTP/1.1
```

**Get presentation collection in townhall**
```http
GET /api/v1/townhalls/1/presentations HTTP/1.1
```

**Get single presentation resource**
```http
GET /api/v1/presentation/1 HTTP/1.1
``` 

**Fields**
- portal_id
- name
- description
- type *(video, video_slide, audio, audio_slide)*
- duration
- date
- video_url
- visible

**Sub-resources**
- slides
- conferences
- townhalls
- presenters
- documents


### Townhall Auth

**User Log-in**
```http
POST /api/v1/townhalls/1/auth HTTP/1.1
X-Portal-Token: M!nb&KypG1o$NP1eoig%rkaykZkZ$tUiQ*0T

{
    "first_name": "Bob",
    "last_name": "Smith",
    "email": "bob@company.com",
    "password": "iLoveCats"
}
```

::: tip
Townhall log-in forms (e.g. registration) are now buit using the same registration form functionality as conferences. This includes support for all common fields (First Name, Last Name, Email), plus any custom fields you would like to add (e.g. Custom Checkbox Field, Hidden Text Field, etc.)
:::

::: warning
If a specific password is required to access the event, you must specify that password as the "Event Password" in the Townhall Admin (`Edit Townhall > Info`), then you must supply a password field in the registration form.
:::
> Returns a `HTTP 201` status code, and a payload, including user info for use in the template context, and a JSON Web Token for authenticating requests through  the API

**API Response**
```json
{
    "token": "z6eWaDASp7WX1z7ls9cjyPKmNiYpMEDye1f0f4xp",
    "role": "user",
    "first_name": "Bob",
    "last_name": "Smith",
    "email": "bob@company.com"
}
```

**User Log-out**

```http
DELETE /api/v1/townhalls/1/auth?token=z6eWaDASp7WX1z7ls9cjyPKmNiYpMEDye1f0f4xp HTTP/1.1
```

>The log-out API call will return an `HTTP 204` status code, and clear any server side references to the user & token. Additionally, any client side references to the user information and token (e.g. cookies, localStorage, etc.) should also be removed.

### Townhalls

**Get townhall collection**
```http
GET /api/v1/townhalls HTTP/1.1
``` 

**Get single townhall resource**
```http
GET /api/v1/townhalls/1 HTTP/1.1
``` 

**Fields**
- portal_id
- name
- subtitle
- slug
- description
- photo
- state *(hidden, upcoming, live, archive)*
- timezone
- start_date
- end_date
- referrer_url
- survey_enabled
- survey_label
- survey_url
- question_enabled
- question_label
- question_email
- channel

**Sub-resources**
- registration_form
- live_stream
- presentations
- presenters
- keynotes
- sponsors


### Affiliates

**Get affiliate collection from conference**
```http
GET /api/v1/conferences/1/affiliates HTTP/1.1
```

**Filter sponsors from affiliate collection in conference**
```http
GET /api/v1/conferences/1/affiliates?filters[role]=sponsor HTTP/1.1
```

**Filter sponsors from affiliate collection in townhall**
```http
GET /api/v1/townhalls/1/affiliates?filters[role]=sponsor HTTP/1.1
```

**Get single affiliate resource**
```http
GET /api/v1/affiliates/1 HTTP/1.1
``` 

**Fields**
- client_id
- name
- biography
- contact_name
- contact_email
- contact_phone
- contact_title
- contact_address
- contact_location
- website
- photo
- role *(sponsor, exhibitor)*
	- **Note:** `role` property is only available if retrieving affiliates in the context of a conference, townhall or presentation.

**Sub-resources**
- conferences
- presentations

### Presenters

**Get presenter collection in conference**
```http
GET /api/v1/conferences/1/presenters HTTP/1.1
```

**Filter keynotes from presenter collection in conference**
```http
GET /api/v1/conferences/1/presenters?filters[role]=keynote HTTP/1.1
```

**Filter cochairs from presenter collection in conference**
```http
GET /api/v1/conferences/1/presenters?filters[role]=cochair HTTP/1.1
```

**Get presenter collection in townhall**
```http
GET /api/v1/townhalls/1/presenters HTTP/1.1
```

**Get presenter collection in presentation**
```http
GET /api/v1/presentations/1/presenters HTTP/1.1
```

**Get single presenter resource**
```http
GET /api/v1/presenters/1 HTTP/1.1
```

**Fields**
- client_id
- first_name
- last_name
- designations
- email
- title
- company
- biography
- website
- photo
- role *(sponsor, exhibitor)* 
	- **Note:** `role` property is only available if retrieving presenters in the context of a conference, townhall or presentation.

**Sub-resources**
- conferences
- townhalls 
- presentations