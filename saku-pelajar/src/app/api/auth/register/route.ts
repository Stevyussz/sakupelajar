import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    await dbConnect();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ name, email, password: hashedPassword });
        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        console.error('Register Error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
