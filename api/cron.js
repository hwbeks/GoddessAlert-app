export default async function handler(req, res) {
  const response = await fetch(
    "https://bcsyjkbhimsvbzufczyu.supabase.co/functions/v1/send-reminders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjc3lqa2JoaW1zdmJ6dWZjenl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjI1OTksImV4cCI6MjA5MTEzODU5OX0.m09NtiYISdO5OzGidt06tWM9WtAQzhzjGD4oX7696Y0",
      },
      body: JSON.stringify({}),
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
