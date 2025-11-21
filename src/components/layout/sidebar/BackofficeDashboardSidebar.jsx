'use client'

import * as React from 'react'
import {
  AudioWaveform,
  Command,
  FilePlus2,
  GalleryVerticalEnd,
  Home,
  LucideBookCopy,
  UserCheck2Icon,
  UserPlus2,
  UsersRound,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import { SidebarNavMain } from './SidebarNavMain'
import { SidebarNavUser } from './SidebarNavUser'

const data = {
  user: {
    name: 'Administrator',
    email: 'developer@dev.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      groupName: 'Dashboard',
      showGroupLabel: false,
      items: [
        {
          title: 'Overview',
          url: '/backoffice/overview',
          icon: Home,
          isActive: true,
          items: null,
        },
        {
          title: 'Course',
          url: '/backoffice/course',
          icon: LucideBookCopy,
          isActive: true,
          items: [
            {
              title: 'Courses',
              url: '/backoffice/course',
            },
            {
              title: 'Quiz',
              url: '/backoffice/quiz',
            },
            {
              title: 'Module',
              url: '/backoffice/module',
            },
          ],
        },
        {
          title: 'Mentors',
          url: '/backoffice/mentor',
          icon: UserCheck2Icon,
          isActive: true,
          items: null,
        },
        {
          title: 'Mentor Registration',
          url: '/backoffice/mentor/registration',
          icon: UserPlus2,
          isActive: true,
          items: null,
        },
        {
          title: 'Enrollments',
          url: '/backoffice/enrollment',
          icon: FilePlus2,
          isActive: true,
          items: null,
        },
        {
          title: 'Users',
          url: '/backoffice/user',
          icon: UsersRound,
          isActive: true,
          items: null,
        },
      ],
    },
  ],
}

export function BackofficeDashboardSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-primary-foreground text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image
                  src="/assets/images/img-logo-learniverse.png"
                  width={320}
                  height={320}
                  alt="Learniverse Logo"
                  className="size-10"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Learniverse</span>
                <span className="truncate text-xs">Backoffice</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
