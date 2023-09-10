interface ErrorResponse {
  error: string;
  details?: any;
}

async function request<T>(url: string, method: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
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
  const url = `/api/send-email`;
  return await request<{
    nickname: string;
    fromEmail: string;
    content: string;
    subject?: string;
    html?: string;
  }>(url, 'POST', {
    nickname: nickname,
    email: fromEmail,
    message: content,
    subject: subject,
    html: html,
  });
};
