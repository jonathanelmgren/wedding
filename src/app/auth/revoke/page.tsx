const Page = async ({ searchParams }: { searchParams: { token: string } }) => {
  try {
    const res = await fetch("https://oauth2.googleapis.com/revoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `token=${encodeURIComponent(searchParams.token)}`,
    });
    if (!res.ok) throw new Error("Failed to revoke token");
    return (
      <div className="relative min-h-screen">
        <div>Success</div>
      </div>
    );
  } catch (e) {
    return <div>Failed</div>;
  }
};

export default Page;
