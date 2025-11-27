export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json({ msg: "Logged out" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Fail to logout" }, { status: 500 });
  }
}
