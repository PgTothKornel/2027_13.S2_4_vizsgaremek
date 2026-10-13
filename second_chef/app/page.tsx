import SecondChefProvider from '@/app/components/SecondChefProvider';
import PageView from '@/app/components/PageView';
import PageMotion from '@/app/components/PageMotion';
import { SiteHeader, MobileAppNav } from '@/app/components/navigation/Navigation';
import HeroSection from '@/app/components/home/HeroSection';
import Marquee from '@/app/components/home/Marquee';
import IntroSection from '@/app/components/home/IntroSection';
import HowItWorks from '@/app/components/home/HowItWorks';
import FeaturesSection from '@/app/components/home/FeaturesSection';
import RecipeShowcase from '@/app/components/home/RecipeShowcase';
import CallToAction from '@/app/components/home/CallToAction';
import SiteFooter from '@/app/components/home/SiteFooter';
import { DiscoverView, FavoritesView } from '@/app/components/recipes/RecipeViews';
import RecipeModal from '@/app/components/recipes/RecipeModal';
import PantryView from '@/app/components/pantry/PantryView';
import ShoppingView from '@/app/components/shopping/ShoppingView';
import ProfileView from '@/app/components/profile/ProfileView';

export default function Page() {
  return (
    <SecondChefProvider>
      <PageMotion />
      <SiteHeader />
      <main>
        <PageView name="home">
          <HeroSection />
          <Marquee />
          <IntroSection />
          <HowItWorks />
          <FeaturesSection />
          <RecipeShowcase />
          <CallToAction />
          <SiteFooter />
        </PageView>
        <PageView name="discover"><DiscoverView /></PageView>
        <PageView name="pantry"><PantryView /></PageView>
        <PageView name="favorites"><FavoritesView /></PageView>
        <PageView name="shopping"><ShoppingView /></PageView>
        <PageView name="profile"><ProfileView /></PageView>
      </main>
      <MobileAppNav />
      <RecipeModal />
    </SecondChefProvider>
  );
}
