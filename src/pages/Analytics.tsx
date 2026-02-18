import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const barData = [
    { name: 'Mon', active: 2400, new: 1200 },
    { name: 'Tue', active: 3000, new: 1800 },
    { name: 'Wed', active: 2000, new: 2400 },
    { name: 'Thu', active: 2780, new: 1900 },
    { name: 'Fri', active: 1890, new: 2200 },
    { name: 'Sat', active: 2390, new: 1500 },
    { name: 'Sun', active: 3490, new: 2800 },
];

const pieData = [
    { name: 'Mobile', value: 400 },
    { name: 'Desktop', value: 300 },
    { name: 'Tablet', value: 200 },
];

const COLORS = ['#7c3aed', '#10b981', '#f59e0b'];

const Analytics: React.FC = () => {
    return (
        <div className="animate-fade">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Analytics</h1>
                <p style={{ color: 'var(--text-muted)' }}>Deep dive into your application performance and user engagement.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>User Growth</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(24, 24, 27, 0.95)',
                                        border: '1px solid rgba(63, 63, 70, 0.4)',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="active" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="new" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Device Distribution</h3>
                    <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(24, 24, 27, 0.95)',
                                        border: '1px solid rgba(63, 63, 70, 0.4)',
                                        borderRadius: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '2rem' }}>
                            {pieData.map((item, index) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: COLORS[index] }} />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.name}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{((item.value / 900) * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Traffic Sources</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(24, 24, 27, 0.95)',
                                    border: '1px solid rgba(63, 63, 70, 0.4)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Line type="monotone" dataKey="active" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed', strokeWidth: 2, stroke: '#09090b' }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#09090b' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
