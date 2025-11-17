'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  ArrowUpDown,
  Star,
  Bell,
  History,
  Menu,
  X,
  BookOpen,
  Briefcase,
  ScanSearch,
  GitCompare,
  Trophy,
  Sparkles,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'
import { RobotLogo } from '@/components/ui/RobotLogo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MARKET_CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import { cn, formatVolume } from '@/lib/utils'
import { useAlertNotifications } from '@/hooks/useAlertNotifications'
// import { useOnboarding } from '@/components/onboarding/OnboardingProvider'
// import { HelpButton } from '@/components/onboarding/HelpButton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ComingSoonModal } from '@/components/ui/coming-soon-modal'

interface MarketHeaderProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearch: () => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  marketStats: {
    totalMarkets: number
    totalVolume: number
    trendingMarkets: number
  }
}

export function MarketHeader({
  searchTerm,
  onSearchChange,
  onSearch,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  marketStats
}: MarketHeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState<{
    name: string
    description?: string
    benefits?: string[]
  } | null>(null)
  const { triggeredCount } = useAlertNotifications()
  
  // Onboarding - deactivated
  // const onboardingContext = useOnboarding()

  const proFeatures = [
    {
      name: 'Portfolio Tracking',
      icon: Briefcase,
      description: 'Track your positions across all markets with real-time P&L analytics.',
      benefits: [
        'Track positions across markets',
        'Real-time P&L dashboard',
        'Performance analytics & charts',
        'Win/loss tracking',
        'Export portfolio data'
      ]
    },
    {
      name: 'Market Scanner',
      icon: ScanSearch,
      description: 'Advanced market discovery with powerful filters and saved searches.',
      benefits: [
        'Advanced filtering options',
        'Saved search presets',
        'Bulk market operations',
        'Custom market dashboards',
        'Market correlation analysis'
      ]
    },
    {
      name: 'Market Compare',
      icon: GitCompare,
      description: 'Compare multiple markets side-by-side to make better decisions.',
      benefits: [
        'Side-by-side market comparison',
        'Price correlation analysis',
        'Volume & liquidity comparison',
        'Historical trend comparison',
        'Export comparison reports'
      ]
    },
    {
      name: 'Signal Leaderboard',
      icon: Trophy,
      description: 'Discover top-performing traders and copy their winning signals.',
      benefits: [
        'Trader performance rankings',
        'Copy trading signals',
        'Signal success rates',
        'Follow top traders',
        'Historical performance data'
      ]
    },
    {
      name: 'Points & Rewards',
      icon: Award,
      description: 'Earn points for every action and unlock exclusive rewards, tiers, and free AI analyses.',
      benefits: [
        'Earn points for daily activities (login, browsing, alerts)',
        'Unlock reward tiers (Bronze, Silver, Gold, Platinum, Diamond)',
        'Redeem points for free AI analyses',
        'Track achievements and milestones',
        'Weekly leaderboards and challenges',
        'Exclusive Pro tier benefits and discounts'
      ]
    }
  ]

  const handleProFeatureClick = (feature: typeof proFeatures[0]) => {
    setComingSoonFeature({
      name: feature.name,
      description: feature.description,
      benefits: feature.benefits
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="polycaster-header-gradient sticky top-0 z-50 border-b border-blue-200 dark:border-blue-700"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 gap-1.5 sm:gap-2">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-shrink-0 min-w-0 hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 polycaster-gradient rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20 flex-shrink-0">
              <RobotLogo size="md" animated={true} className="drop-shadow-lg" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-md truncate">
                PolyCaster
              </h1>
              <p className="text-[10px] sm:text-xs text-blue-200 font-medium hidden sm:block">
                AI-Powered Prediction Markets
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full" data-onboarding="search">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search markets... (Press Enter)"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onSearch()
                  }
                }}
                className="pl-10 pr-10 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden text-white hover:bg-white/10 p-1.5 sm:p-2 flex-shrink-0"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm"
            >
              <Link href="/help">
                <BookOpen className="w-4 h-4" />
                <span className="hidden xl:inline">FAQ</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm"
            >
              <Link href="/watchlist" data-onboarding="watchlist">
                <Star className="w-4 h-4" />
                <span className="hidden xl:inline">Watchlist</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 relative text-sm"
            >
              <Link href="/alerts" data-onboarding="alerts">
                <Bell className="w-4 h-4" />
                <span className="hidden xl:inline">Alerts</span>
                {triggeredCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse text-[10px]">
                    {triggeredCount > 9 ? '9+' : triggeredCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm"
            >
              <Link href="/history">
                <History className="w-4 h-4" />
                <span className="hidden xl:inline">History</span>
              </Link>
            </Button>
            
            {/* Pro Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm border border-white/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden xl:inline">Pro</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Pro Features
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {proFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <DropdownMenuItem
                      key={feature.name}
                      onClick={() => handleProFeatureClick(feature)}
                      className="cursor-pointer"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{feature.name}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />
            {/* {onboardingContext && (
              <HelpButton onStartTour={onboardingContext.startTour} />
            )} */}
            <div className="hidden xl:block" data-onboarding="wallet">
              <ConnectButton
                client={client}
                wallets={wallets}
                theme="dark"
                connectModal={{
                  size: "compact",
                  title: "Connect Wallet",
                  showThirdwebBranding: false,
                  welcomeScreen: {
                    title: "Welcome to PolyCaster",
                    subtitle: "Connect with email or wallet (EVM or Solana supported)",
                  },
                }}
                connectButton={{
                  label: "Connect",
                  className: "polycaster-gradient hover:opacity-90 text-white font-medium px-3 py-1.5 text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
                }}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:hidden flex-shrink-0">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:bg-white/10 p-1.5 sm:p-2"
            >
              {showMobileMenu ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-2 sm:pb-3 px-2 sm:px-0"
          >
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search markets... (Press Enter)"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onSearch()
                  }
                }}
                className="pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSearch}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 py-2 sm:py-3 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-1.5 sm:space-y-2">
              {/* Theme Toggle for Mobile - Show in menu */}
              <div className="sm:hidden px-2 py-1.5 border-b border-white/10">
                <ThemeToggle />
              </div>
              <Link href="/help" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>FAQ</span>
                </Button>
              </Link>
              <Link href="/watchlist" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2"
                >
                  <Star className="w-4 h-4" />
                  <span>Watchlist</span>
                </Button>
              </Link>
              <Link href="/alerts" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span>Alerts</span>
                  {triggeredCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {triggeredCount > 9 ? '9+' : triggeredCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/history" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </Button>
              </Link>
              
              {/* Pro Features - Mobile */}
              <div className="pt-2 border-t border-white/10">
                <div className="px-2 py-1 text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                  Pro Features
                </div>
                {proFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Button
                      key={feature.name}
                      variant="ghost"
                      onClick={() => {
                        setShowMobileMenu(false)
                        handleProFeatureClick(feature)
                      }}
                      className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{feature.name}</span>
                    </Button>
                  )
                })}
              </div>

              <div className="pt-2 border-t border-white/10 px-2">
                <div className="w-full">
                  <ConnectButton
                    client={client}
                    wallets={wallets}
                    theme="dark"
                    connectModal={{
                      size: "compact",
                      title: "Connect Wallet",
                      showThirdwebBranding: false,
                      welcomeScreen: {
                        title: "Welcome to PolyCaster",
                        subtitle: "Connect with email or wallet (EVM or Solana supported)",
                      },
                    }}
                    connectButton={{
                      label: "Connect Wallet",
                      className: "w-full polycaster-gradient hover:opacity-90 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Market Stats */}
        <div className="py-2 sm:py-3 md:py-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4">
            <div className="text-center px-1 sm:px-0">
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                {marketStats.totalMarkets.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Total Markets</div>
            </div>
            <div className="text-center px-1 sm:px-0">
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                {formatVolume(marketStats.totalVolume)}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Total Volume</div>
            </div>
            <div className="text-center px-1 sm:px-0">
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                {marketStats.trendingMarkets.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Trending</div>
            </div>
          </div>
        </div>

        {/* Filters and Categories */}
        <div className="py-2 sm:py-3 md:py-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            {/* Category Filters */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1.5 sm:pb-2 -mx-2 px-2 scrollbar-hide" data-onboarding="categories">
              {MARKET_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={cn(
                    "whitespace-nowrap transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1 sm:py-1.5 flex-shrink-0",
                    selectedCategory === category
                      ? "polymarket-gradient text-white shadow-md"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 justify-end sm:justify-start">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-white/10 text-white border-white/20 rounded-md px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[100px] sm:min-w-[120px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-1 sm:p-1.5 md:p-2 h-auto"
              >
                <ArrowUpDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {comingSoonFeature && (
        <ComingSoonModal
          isOpen={!!comingSoonFeature}
          onClose={() => setComingSoonFeature(null)}
          featureName={comingSoonFeature.name}
          featureDescription={comingSoonFeature.description}
          proBenefits={comingSoonFeature.benefits}
        />
      )}
    </motion.div>
  )
}
