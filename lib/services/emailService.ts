interface ErrorResponse {
  error: string;
  details?: any;
}

async function request<T>(url: string, method: string, body?: any, token?: string): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      token: token ?? '',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    console.log(error.details);
    throw new Error(error.error);
  }

  const data: T = await response.json();
  return data;
}

export const sendEmail = async (
  nickname: string,
  fromEmail: string,
  content: string,
  subject?: string,
  html?: string
) => {
  const url = `/api/mail`;
  return await request<{ message: string }>(url, 'POST', {
    nickname: nickname,
    email: fromEmail,
    message: content,
    subject: subject,
    html: html,
  });
};
