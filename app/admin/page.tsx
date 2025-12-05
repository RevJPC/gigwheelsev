"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import Link from "next/link";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeReservations: 0,
    monthlyRevenue: 0,
    loading: true
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load vehicles
      const { data: vehicles } = await client.models.Vehicle.list();

      // Load reservations
      const { data: reservations } = await client.models.Reservation.list();

      // Calculate active reservations (PENDING or CONFIRMED)
      const activeCount = reservations.filter(
        r => r.status === 'PENDING' || r.status === 'CONFIRMED'
      ).length;

      // Calculate monthly revenue (completed this month)
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRevenue = reservations
        .filter(r => {
          const endDate = new Date(r.endTime);
          return r.status === 'COMPLETED' && endDate >= firstDayOfMonth;
        })
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      setStats({
        totalVehicles: vehicles.length,
        activeReservations: activeCount,
        monthlyRevenue: monthlyRevenue,
        loading: false
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Vehicles */}
        <Link href="/admin/vehicles" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Vehicles</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.loading ? '...' : stats.totalVehicles}
            </dd>
          </div>
        </Link>

        {/* Active Reservations */}
        <Link href="/admin/reservations" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Reservations</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.loading ? '...' : stats.activeReservations}
            </dd>
          </div>
        </Link>

        {/* Monthly Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Revenue (Month)</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.loading ? '...' : `$${stats.monthlyRevenue.toFixed(2)}`}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
