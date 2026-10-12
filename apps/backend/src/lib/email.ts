type Email = { to: string; subject: string; text: string };
export async function sendEmail({ to, subject, text }: Email) {
    if (process.env.NODE_ENV === "production") {
        throw new Error("No email provider is configured");
    }
    console.log(`\n✉️  to: ${to}\n   subject: ${subject}\n\n${text}\n`);
}
