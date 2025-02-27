# Fetch Take Home Design Notes

To start:

## 1. Setup


### 1.1 Install Locally

Download from https://github.com/dcotelessa/fetch-take-home

I used pnpm to install packages. Then I ran `pnpm dev` to start the app.

```bash
pnpm install
pnpm dev
```

It should run on http://localhost:3000.

### 1.2 Deployed to Vercel

A live version is running on https://fetch-take-home-phi.vercel.app

## 2. API testing

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

I needed to create a domain based design, building folders in this manner:
1. `hooks` is our custom hooks for authentication and data retrival.
2. `context` is where we store the global states.
3. `ui` is our React displays, pages and components.
4. `src` is our root, with in next.js is `app` or `pages`

This was the initial setup. It includes unfinished Location Filters. Tests were created but we did not finish.

```
app/
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

## 3. Other Notes

We want to limit the contexts and api calls so their infrastructure is mostly hidden, but their interfaces are strict to the prerequisites in the README.

We are keeping interfaces and api call within the custom hooks.
Any data returned from the api calls will be stored within the contexts, especially if called from multiple components.

UseContext over a library like Zustand was to keep library creep to a minimum. Zustand might provide simplier better management, but the contexts are decoupled here if we wanted to go that route later on.

Using next.js was an easy way to deploy to Vercel, but it could be replaced with a custom server if we wanted to go that route, especially limiting the server component usage. That said, changes were needed to meet Vercel's strict standards to run, mostly liniting errors.

I opted to stop work on Location Filters, though it is most likely that we would focus on city names, US States (in button arrangement like we did with Breeds), and a checkbox to consider using broswer's internal geolocation information to calculate bounding boxes for certain radii of locations. The resulting zipcodes could be displayed with their corresponding locations before using as a filter. In short, location is a big feature that while should be tackled, is beyond the scope of the minimum requirements.

Most errors are simple server call errors or authentication expirations so most point back to he login page.

I added some validation on the name and email, though completely unneccessary since we aren't storing. Still input should be validated.

## 4. Future Improvements

- Add Location Filters
- Add more dog attributes
- More test coverage (and working ones)
- Throttling API calls for rate limiting
