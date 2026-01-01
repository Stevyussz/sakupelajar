import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { UserProfileForm } from "@/components/Profile/UserProfileForm";
import { AvatarSelector } from "@/components/Profile/AvatarSelector";
import { DangerZone } from "@/components/Profile/DangerZone";
import { GlassCard } from "@/components/UI/GlassCard";
import { SignOutButton } from "@/components/Profile/SignOutButton";
import { Shield, User as UserIcon, Settings } from "lucide-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    await dbConnect();
    const user = await User.findById(session.user.id).lean();

    return (
        <div className="p-6 md:p-8 space-y-8 pb-24 max-w-4xl mx-auto">
            <header>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Profile & Settings <Settings className="w-6 h-6 text-slate-400" />
                </h1>
                <p className="text-slate-500">Manage your account and preferences.</p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* 1. Account Details */}
                <section>
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-blue-500" /> Account Information
                    </h2>
                    <div className="space-y-6">
                        <AvatarSelector currentAvatar={user.avatarId} />
                        <UserProfileForm user={{ name: user.name, email: user.email, level: user.level }} />
                    </div>
                </section>

                {/* 2. Security / Danger Zone */}
                <section>
                    <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Danger Zone
                    </h2>
                    <GlassCard className="p-6 border-l-4 border-red-500">
                        <p className="text-slate-600 mb-4">
                            Actions here are irreversible. Please proceed with caution.
                        </p>
                        <DangerZone userId={user._id.toString()} />
                    </GlassCard>
                </section>

                <div className="pt-4">
                    <SignOutButton />
                </div>
            </div>
        </div>
    );
}
