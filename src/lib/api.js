const FIREBASE_DOMAIN =
  "https://qoutes-d375f-default-rtdb.europe-west1.firebasedatabase.app/";

export async function getAllQuotes() {
  const response = await fetch(`${FIREBASE_DOMAIN}/quotes.json`);
  const data = await response.json();

  if (!response.ok || !data) {
    throw new Error("Could not fetch quotes.");
  }

  const transformedQuotes = [];

  for (const key in data) {
    const quoteObj = {
      id: key,
      ...data[key],
    };

    transformedQuotes.push(quoteObj);
  }

  return transformedQuotes;
}

export async function getSingleQuote(quoteId) {
  const response = await fetch(`${FIREBASE_DOMAIN}/quotes/${quoteId}.json`);
  const data = await response.json();
  if (!response.ok || !data) {
    throw new Error("Could not fetch quote.");
  }
  const loadedQuote = {
    id: quoteId,
    ...data,
  };

  return loadedQuote;
}

export async function addQuote(quoteData) {
  const quote = {
    text: quoteData.text,
    author: quoteData.author,
  };

  if (quote.text === "" || quote.author === "") {
    return { isError: true, message: "Invalid input data provided." };
  }
  const response = await fetch(`${FIREBASE_DOMAIN}/quotes.json`, {
    method: "POST",
    body: JSON.stringify(quoteData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Could not create quote.");
  }

  return null;
}

export async function addComment(requestData) {
  const comment = requestData.commentData.text;
  if (comment === "") {
    return { isError: true, message: "Please Eneter a Valid Comment." };
  }
  const response = await fetch(
    `${FIREBASE_DOMAIN}/comments/${requestData.quoteId}.json`,
    {
      method: "POST",
      body: JSON.stringify(requestData.commentData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Could not add comment.");
  }
}

export async function getAllComments(quoteId) {
  const response = await fetch(`${FIREBASE_DOMAIN}/comments/${quoteId}.json`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Could not get comments.");
  }

  const transformedComments = [];

  for (const key in data) {
    const commentObj = {
      id: key,
      ...data[key],
    };

    transformedComments.push(commentObj);
  }

  return transformedComments;
}
