import CheckoutPage from "@/components/modules/pages/checkout-page";
import { generateSEOMetadata, getMessages } from "@/lib/intl";
import { currentUser } from "@clerk/nextjs/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function page() {
  const user = await currentUser();
  if (!user) {
    return <div>wait</div>;
  }
  return (
    <CheckoutPage
      firstName={user.firstName!}
      lastName={user.lastName!}
      email={user.emailAddresses[0].emailAddress}
    />
  );
}
export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return generateSEOMetadata(
    messages,
    "seo.checkout.title",
    "seo.checkout.description",
    locale
  );
}
