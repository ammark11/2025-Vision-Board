import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { 
  FiTrendingUp, FiAward, FiStar, FiHeart, 
  FiCalendar, FiActivity, FiPieChart, FiBarChart2 
} from 'react-icons/fi';

const COLORS = ['#FF69B4', '#00FFFF', '#FFB6C1', '#DDA0DD', '#87CEEB'];

function Dashboard({ goals }) {
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
    categoryDistribution: [],
    weeklyProgress: [],
    monthlyTrends: [],
    activityHeatmap: [],
    milestoneBreakdown: []
  });

  useEffect(() => {
    calculateStats();
  }, [goals]);

  const calculateStats = () => {
    // Basic stats
    const completed = goals.filter(goal => goal.progress === 100).length;
    const avgProgress = goals.reduce((acc, goal) => acc + (goal.progress || 0), 0) / goals.length || 0;

    // Category distribution
    const categories = {};
    goals.forEach(goal => {
      categories[goal.category] = (categories[goal.category] || 0) + 1;
    });

    // Weekly progress (last 7 days)
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString(),
        progress: Math.random() * 100 // Replace with actual progress tracking
      };
    }).reverse();

    // Monthly trends (last 12 months)
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        completed: Math.floor(Math.random() * 10), // Replace with actual data
        active: Math.floor(Math.random() * 15)
      };
    }).reverse();

    // Activity heatmap data (last 365 days)
    const heatmapData = Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 4)
      };
    });

    // Milestone breakdown
    const milestones = [
      { name: '0-25%', value: goals.filter(g => g.progress <= 25).length },
      { name: '26-50%', value: goals.filter(g => g.progress > 25 && g.progress <= 50).length },
      { name: '51-75%', value: goals.filter(g => g.progress > 50 && g.progress <= 75).length },
      { name: '76-99%', value: goals.filter(g => g.progress > 75 && g.progress < 100).length },
      { name: '100%', value: completed }
    ];

    setStats({
      totalGoals: goals.length,
      completedGoals: completed,
      averageProgress: avgProgress.toFixed(1),
      categoryDistribution: Object.entries(categories).map(([name, value]) => ({ name, value })),
      weeklyProgress: weeklyData,
      monthlyTrends: monthlyData,
      activityHeatmap: heatmapData,
      milestoneBreakdown: milestones
    });
  };

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="dashboard-title">Progress Dashboard</h2>

      <div className="stats-overview">
        <StatCard
          icon={FiTrendingUp}
          title="Total Goals"
          value={stats.totalGoals}
          color="#FF69B4"
        />
        <StatCard
          icon={FiAward}
          title="Completed"
          value={stats.completedGoals}
          color="#00FFFF"
        />
        <StatCard
          icon={FiActivity}
          title="Avg Progress"
          value={`${stats.averageProgress}%`}
          color="#FFB6C1"
        />
      </div>

      <div className="charts-grid">
        {/* 1. Weekly Progress Line Chart */}
        <ChartCard title="Weekly Progress">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#FF69B4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Monthly Trends Area Chart */}
        <ChartCard title="Monthly Trends">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#FF69B4" fill="#FF69B4" />
              <Area type="monotone" dataKey="active" stackId="1" stroke="#00FFFF" fill="#00FFFF" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Category Distribution Pie Chart */}
        <ChartCard title="Category Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Milestone Breakdown Bar Chart */}
        <ChartCard title="Milestone Breakdown">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.milestoneBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF69B4">
                {stats.milestoneBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Activity Heatmap */}
        <ChartCard title="Activity Heatmap" fullWidth>
          <CalendarHeatmap
            startDate={new Date('2023-01-01')}
            endDate={new Date('2023-12-31')}
            values={stats.activityHeatmap}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              return `color-scale-${value.count}`;
            }}
          />
        </ChartCard>
      </div>
    </motion.div>
  );
}

// Helper Components
const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div
    className="stat-card"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring" }}
  >
    <div className="stat-icon" style={{ backgroundColor: color }}>
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, fullWidth }) => (
  <motion.div 
    className={`chart-card ${fullWidth ? 'full-width' : ''}`}
    whileHover={{ scale: 1.02 }}
  >
    <h3 className="chart-title">{title}</h3>
    {children}
  </motion.div>
);

export default Dashboard; 