"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { fetchUserAttributes } from "aws-amplify/auth";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function UsersManagement() {
    const [users, setUsers] = useState<Array<Schema["UserProfile"]["type"]>>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<Schema["UserProfile"]["type"] | null>(null);
    const [editedData, setEditedData] = useState<any>({});
    const [currentUserId, setCurrentUserId] = useState<string>("");

    useEffect(() => {
        loadCurrentUser();
        const sub = client.models.UserProfile.observeQuery().subscribe({
            next: (data) => {
                setUsers([...data.items]);
                setLoading(false);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    const loadCurrentUser = async () => {
        try {
            const attributes = await fetchUserAttributes();
            setCurrentUserId(attributes.sub || "");
        } catch (error) {
            console.error("Error loading current user:", error);
        }
    };

    const updateUserRole = async (userId: string, profileId: string, newRole: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN') => {
        try {
            await client.models.UserProfile.update({
                id: profileId,
                role: newRole
            });
            console.log(`Updated role for user ${userId} to ${newRole}`);
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role');
        }
    };

    const updateUserStatus = async (profileId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
        try {
            await client.models.UserProfile.update({
                id: profileId,
                status: newStatus
            });
            console.log(`Updated status for user ${profileId} to ${newStatus}`);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status');
        }
    };

    const deleteUser = async (userId: string, profileId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will remove them from Cognito.')) return;

        try {
            const { errors } = await client.mutations.deleteUser({
                userId: userId
            });

            if (errors) {
                throw new Error(errors[0].message);
            }

            await client.models.UserProfile.delete({
                id: profileId
            });

            setUsers(users.filter(u => u.id !== profileId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const openUserDetails = (user: Schema["UserProfile"]["type"]) => {
        setSelectedUser(user);
        setEditedData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phoneNumber: user.phoneNumber || "",
            streetAddress: user.streetAddress || "",
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipCode || "",
            licenseNumber: user.licenseNumber || "",
            insurancePolicyNumber: user.insurancePolicyNumber || "",
        });
    };

    const requestProfileChange = async () => {
        if (!selectedUser) return;

        try {
            console.log("=== REQUESTING PROFILE CHANGE ===");
            console.log("Selected user:", selectedUser);
            console.log("Edited data:", editedData);

            // Generate a unique token
            const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
            console.log("Generated token:", token);

            // Create the change request
            const { data: changeRequest, errors: createErrors } = await client.models.ProfileChangeRequest.create({
                userId: selectedUser.userId,
                requestedBy: currentUserId,
                newData: JSON.stringify(editedData),
                token: token,
                status: 'PENDING'
            });

            console.log("Change request result:", { changeRequest, createErrors });

            if (changeRequest) {
                console.log("Calling sendChangeEmail...");
                // Send email notification
                const emailResult = await client.mutations.sendChangeEmail({
                    email: selectedUser.email,
                    token: token,
                    requestId: changeRequest.id,
                    changes: JSON.stringify(editedData) // Convert to JSON string
                });

                console.log("Email result:", emailResult);

                alert('Change request sent! The user will receive an email to confirm.');
                setSelectedUser(null);
            } else {
                console.error("Failed to create change request:", createErrors);
                alert('Failed to create change request');
            }
        } catch (error) {
            console.error('Error creating change request:', error);
            alert('Failed to create change request');
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage user roles, status, and permissions.
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
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                                Loading users...
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="py-4 pl-4 pr-3 sm:pl-6">
                                                    <div className="flex items-center">
                                                        {user.profilePictureUrl ? (
                                                            <img src={user.profilePictureUrl} alt="" className="h-10 w-10 rounded-full mr-3 object-cover" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                                                                {user.email[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <div className="font-medium text-gray-900">
                                                                {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'No name'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
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
                                                <td className="px-3 py-4">
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')}
                                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.status === 'SUSPENDED'
                                                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            }`}
                                                    >
                                                        {user.status === 'SUSPENDED' ? 'Suspended' : 'Active'}
                                                    </button>
                                                </td>
                                                <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                    <button
                                                        onClick={() => openUserDetails(user)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View/Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user.userId, user.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
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

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">User Profile Details</h2>
                            <p className="text-sm text-gray-500">{selectedUser.email}</p>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        value={editedData.firstName}
                                        onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        value={editedData.lastName}
                                        onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    value={editedData.phoneNumber}
                                    onChange={(e) => setEditedData({ ...editedData, phoneNumber: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                <input
                                    type="text"
                                    value={editedData.streetAddress}
                                    onChange={(e) => setEditedData({ ...editedData, streetAddress: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-6 gap-4">
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        value={editedData.city}
                                        onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        value={editedData.state}
                                        onChange={(e) => setEditedData({ ...editedData, state: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Zip</label>
                                    <input
                                        type="text"
                                        value={editedData.zipCode}
                                        onChange={(e) => setEditedData({ ...editedData, zipCode: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Driver's License Number</label>
                                <input
                                    type="text"
                                    value={editedData.licenseNumber}
                                    onChange={(e) => setEditedData({ ...editedData, licenseNumber: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Insurance Policy Number</label>
                                <input
                                    type="text"
                                    value={editedData.insurancePolicyNumber}
                                    onChange={(e) => setEditedData({ ...editedData, insurancePolicyNumber: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={requestProfileChange}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Request Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
