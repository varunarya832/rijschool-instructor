
export const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but got ${contentType}:\n${text.slice(0, 200)}`
    );
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch (parseErr) {
    console.error("❌ JSON parse error", parseErr);
    throw new Error("Invalid JSON response:\n" + text.slice(0, 300));
  }

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong!");
  }

  return { success: true, data: payload };
};
