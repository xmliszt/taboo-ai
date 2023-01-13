const query = async (prompt: string): Promise<string> => {
  return new Promise((res, rej) => {
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(process.env.OPENAI_API),
      },
      cache: "no-store",
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        max_tokens: 2048,
      }),
    })
      .then((response) =>
        response.json().then((data) => res(data.choices[0].text))
      )
      .catch((err) => rej(err));
  });
};

export default query;
