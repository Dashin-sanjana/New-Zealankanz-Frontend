import HomePage from '../pages/home/page'
import SearchPage from '../pages/listings/search/page'
import CategoryPage from '../pages/listings/category/page'
import LocationPage from '../pages/listings/location/page'
import AdDetailPage from '../pages/listings/details/page'
import PostAdPage from '../pages/listings/post/page'
import EditAdPage from '../pages/listings/edit/page'
import RegisterPage from '../pages/auth/register/page'
import LoginPage from '../pages/auth/login/page'
import ForgotPasswordPage from '../pages/auth/forgot-password/page'
import ResetPasswordPage from '../pages/auth/reset-password/page'
import EmailVerificationPage from '../pages/auth/verify-email/page'
import UserDashboardPage from '../pages/user/dashboard/page'
import MyAdsPage from '../pages/user/my-ads/page'
import ContactPage from '../pages/contact/page'
import AdminDashboardPage from '../pages/admin/dashboard/page'
import { AdminAllAdsPage, AdminPendingAdsPage } from '../pages/admin/ads/page'
import {
  AdminBannersPage,
  AdminCategoriesPage,
  AdminLocationsPage,
  AdminUsersPage,
} from '../pages/admin/config/page'
import NotFoundPage from '../pages/not-found/page'
import { RequireAdmin, RequireAuth } from '../features/auth/require-auth'
import { paths } from './paths'

export default function AppRoutes({ route, auth }) {
  const [pathname, queryString = ''] = route.split('?')
  const query = new URLSearchParams(queryString)

  if (pathname === paths.root) return <HomePage />
  if (pathname === paths.search) return <SearchPage query={query} />
  if (pathname === paths.register) return <RegisterPage auth={auth} />
  if (pathname === paths.login) return <LoginPage auth={auth} />
  if (pathname === paths.forgotPassword) return <ForgotPasswordPage />
  if (pathname === paths.resetPassword) return <ResetPasswordPage />
  if (pathname === paths.verifyEmail) return <EmailVerificationPage query={query} />
  if (pathname === paths.postAd) return <RequireAuth auth={auth}><PostAdPage /></RequireAuth>
  if (pathname.startsWith('/edit-ad/')) {
    return <RequireAuth auth={auth}><EditAdPage slug={pathname.split('/').pop()} /></RequireAuth>
  }
  if (pathname === paths.dashboard) {
    return <RequireAuth auth={auth}><UserDashboardPage auth={auth} /></RequireAuth>
  }
  if (pathname === paths.myAds) return <RequireAuth auth={auth}><MyAdsPage /></RequireAuth>
  if (pathname === paths.contact) return <ContactPage />
  if (pathname === paths.admin) return <RequireAdmin auth={auth}><AdminDashboardPage /></RequireAdmin>
  if (pathname === paths.adminPendingAds) return <RequireAdmin auth={auth}><AdminPendingAdsPage /></RequireAdmin>
  if (pathname === paths.adminAds) return <RequireAdmin auth={auth}><AdminAllAdsPage /></RequireAdmin>
  if (pathname === paths.adminCategories) return <RequireAdmin auth={auth}><AdminCategoriesPage /></RequireAdmin>
  if (pathname === paths.adminLocations) return <RequireAdmin auth={auth}><AdminLocationsPage /></RequireAdmin>
  if (pathname === paths.adminBanners) return <RequireAdmin auth={auth}><AdminBannersPage /></RequireAdmin>
  if (pathname === paths.adminUsers) return <RequireAdmin auth={auth}><AdminUsersPage /></RequireAdmin>
  if (pathname.startsWith('/category/')) return <CategoryPage slug={pathname.split('/').pop()} />
  if (pathname.startsWith('/location/')) return <LocationPage slug={pathname.split('/').pop()} />
  if (pathname.startsWith('/ads/')) return <AdDetailPage slug={pathname.split('/').pop()} />
  return <NotFoundPage />
}
