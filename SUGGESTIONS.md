# Suggestions

## Major - Improvement in updation logic for position/rank

 Instead of $pull and $push awaited operations , we can simply use [Updating Embedded Arrays - MongoDB](https://www.mongodb.com/docs/drivers/node/current/crud/update/embedded-arrays/)

## (Very?)Minor - Changes to how array is made from NodeList

Instead of a foreach loop which transforms values and creates a new array, we can use the Array.from(iterableObject, mapFn) as an alternative . ONLY if it matters
