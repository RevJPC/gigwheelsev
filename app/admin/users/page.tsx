"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { updateUserAttribute } from "aws-amplify/auth";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function UsersManagement() {
    const [users, setUsers] = useState<Array<Schema["UserProfile"]["type"]>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sub = client.models.UserProfile.observeQuery().subscribe({
            next: (data) => {
                setUsers([...data.items]);
                setLoading(false);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    const updateUserRole = async (userId: string, profileId: string, newRole: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN') => {
        try {
            // Update in database
            await client.models.UserProfile.update({
                id: profileId,
                role: newRole
            });

            // Note: Updating Cognito custom:role attribute requires admin privileges
            // This would typically be done via a Lambda function with admin SDK
            console.log(`Updated role for user ${userId} to ${newRole}`);
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role');
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage user roles and permissions.
                    </p>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            User
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Role
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8 text-gray-500">
                                                Loading users...
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8 text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="py-4 pl-4 pr-3 sm:pl-6">
                                                    <div className="flex flex-col">
                                                        <div className="font-medium text-gray-900">
                                                            {user.name || 'No name'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => updateUserRole(user.userId, user.id, e.target.value as any)}
                                                        className="rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        <option value="CUSTOMER">Customer</option>
                                                        <option value="EMPLOYEE">Employee</option>
                                                        <option value="ADMIN">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <span className="text-xs text-gray-500">
                                                        ID: {user.userId.slice(-8)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
