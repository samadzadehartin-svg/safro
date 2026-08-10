import { SiteHeader } from "@/components/site-header";
import { TourDetails } from "@/components/tour-details";

export default async function TourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <><SiteHeader active="home" /><TourDetails id={Number(id)} /></>;
}
