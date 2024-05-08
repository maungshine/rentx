import Category from "@/components/category";
import Container from "@/components/container";
import FilterButton from "@/components/filter-button";
import HomepageListings from "@/components/homepage-listing";
import LoginForm from "@/components/login-form";
import Main from "@/components/main";
import Search from "@/components/search";
import { getAllListing } from "@/lib/query-listing";
import Image from "next/image";

export default async function Home({ searchParams }: { searchParams: { category: string } }) {

  return (
    <div>
      <Container>

        <Main searchParams={searchParams} />
      </Container>
    </div>
  );
}
