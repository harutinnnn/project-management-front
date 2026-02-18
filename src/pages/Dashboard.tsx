import React from 'react';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: `rgba(${color}, 0.1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={22} style={{ color: `rgb(${color})` }} />
            </div>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <MoreVertical size={18} />
            </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</h3>
                <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: change.startsWith('+') ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    paddingBottom: '4px'
                }}>
                    {change} {change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </span>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    return (
        <div className="animate-fade">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, Alex. Here's what's happening today.</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Total Revenue" value="$45,231" change="+12.5%" icon={DollarSign} color="124, 58, 237" />
                <StatCard title="Active Users" value="2,345" change="+18.2%" icon={Users} color="16, 185, 129" />
                <StatCard title="Total Orders" value="1,205" change="-3.1%" icon={ShoppingBag} color="245, 158, 11" />
                <StatCard title="Growth Rate" value="+14.2%" change="+5.4%" icon={TrendingUp} color="6, 182, 212" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Revenue Analytics</h3>
                        <select style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: 'var(--glass-border)',
                            color: 'var(--text-main)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            outline: 'none',
                            fontSize: '0.85rem'
                        }}>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(24, 24, 27, 0.95)',
                                        border: '1px solid rgba(63, 63, 70, 0.4)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--primary-color)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Orders</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                paddingBottom: '1rem',
                                borderBottom: i !== 4 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ShoppingBag size={18} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Apple iPhone 15 Pro</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 mins ago</span>
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>$999</span>
                            </div>
                        ))}
                        <button style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            color: 'var(--text-main)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}>
                            View All Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
