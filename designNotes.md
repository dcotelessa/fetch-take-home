# Design Notes

To start:

I used pnpm to install packages. Then I ran `pnpm dev` to start the app.

```bash
pnpm install
pnpm dev
```

It should run on http://localhost:3000.

## 1. API testing

I used xh as a tool to test the API. 

1. I created a new user and logged in.
```bash
xh POST https://frontend-take-home-service.fetch.com/auth/login \
    name="Your Name" \
    email="your.email@example.com" \
    --session=fetch
```
2. I tested a GET to the `/dogs/breeds` endpoint.
```bash
xh GET https://frontend-take-home-service.fetch.com/dogs/breeds --session=fetch
```
3. I logged out and then tried to GET the `/dogs/breeds` endpoint.

```bash
xh POST https://frontend-take-home-service.fetch.com/auth/logout \
    --session=fetch

xh GET https://frontend-take-home-service.fetch.com/dogs/breeds --session=fetch
```

## 2. Skeleton

I need to create a domain based design, building folders in this manner:
1. `hooks` is our custom hooks for authentication and data retrival.
2. `context` is where we store the global states.
3. `ui` is our React displays, pages and components.
4. `src` is our root, with in next.js is `app` or `pages`


```
src/
|-- context/
    |-- AgeRangeContext.tsx
    |-- FavoritesContext.tsx
    |-- LocationContext.tsx
    |-- SelectedBreedsContext.tsx
    |-- SizeContext.tsx
    |-- SortDogsContext.tsx
|-- hooks/
    |-- useDogs.ts
    |-- useDogsBreeds.ts
    |-- useDogsMatch.ts
    |-- useDogsParams.ts
    |-- useLoginData.ts
|-- ui/
    |-- components/
        |-- login/
            |-- LoginForm.tsx
        |-- dogs/
            |-- filters/
                |-- ageRangeSelection.css
                |-- AgeRangeSelection.tsx
                |-- BreedsSelection.css
                |-- BreedsSelection.tsx
                |-- index.css
                |-- index.tsx
                |-- LocationSelection.css
                |-- LocationSelection.tsx
                |-- SizeSelection.css
                |-- SizeSelection.tsx
                |-- SortDogsSelection.css
                |-- SortDogsSelection.tsx
        |-- icons/
                |-- LoadingIcon.css
                |-- LoadingIcon.tsx
                |-- SliderHorizontal3.tsx
        |-- BestMatchCard.css
        |-- BestMatchCard.tsx
        |-- DogsCard.css
        |-- DogsCard.tsx
        |-- DogsList.tsx
        |-- Header.css
        |-- Header.tsx
    |-- pages/
        |-- DogsPage.tsx
        |-- LoginPage.tsx
```

## 10. Other Notes

We want to limit the contexts and api calls so their infrastructure is mostly hidden, but their interfaces are strict to the prerequisites in the README.

We are keeping interfaces and api call within the custom hooks.
Any data returned from the api calls will be stored within the contexts, especially if called from multiple components.

UseContext over a library like Zustand was to keep library creep to a minimum. Zustand might provide simplier better management, but the contexts are decoupled here if we wanted to go that route later on.

Using next.js was an easy way to deploy to Vercel, but it could be replaced with a custom server if we wanted to go that route, especially limiting the server component usage.
