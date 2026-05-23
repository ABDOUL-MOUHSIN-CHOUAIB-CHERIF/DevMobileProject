import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AnalyticsPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lineChart', { static: false }) lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart', { static: false }) donutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart', { static: false }) barChartRef!: ElementRef<HTMLCanvasElement>;

  lineChart?: Chart;
  donutChart?: Chart;
  barChart?: Chart;

  userName = 'User';
  userId = '';

  tabs = ['Daily', 'Weekly', 'Monthly', 'Annual'];
  selectedTab = 'Monthly';

  constructor(private router: Router) {
    Chart.register(...registerables);
  }

   async ngOnInit() : Promise<void> {
      //  Check Authentication Session
      const session = localStorage.getItem('active_user');
      if (!session) {
        this.router.navigate(['/login']);
        return;
      }

      const user = JSON.parse(session)
      this.userName = user.name || 'User';
      this.userId = user.id || '';
   }

  ngAfterViewInit(): void {
    this.initLineChart();
    this.initDonutChart();
    this.initBarChart();
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
    this.donutChart?.destroy();
    this.barChart?.destroy();
  }

  setTab(tab: string): void {
    if (this.selectedTab === tab) {
      return;
    }
    this.selectedTab = tab;
    this.updateCharts();
  }

  private initLineChart(): void {
    const canvas = this.lineChartRef?.nativeElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 140);
    gradient.addColorStop(0, 'rgba(59,79,216,.18)');
    gradient.addColorStop(1, 'rgba(59,79,216,0)');

    const { labels, actual, projected } = this.getLineData(this.selectedTab);

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: actual,
            borderColor: '#1a2255',
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.45,
            fill: true,
            backgroundColor: gradient,
          },
          {
            data: projected,
            borderColor: '#3b4fd8',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            tension: 0.45,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }

  private initDonutChart(): void {
    const canvas = this.donutChartRef?.nativeElement;
    if (!canvas) {
      return;
    }

    const data = this.getDonutData(this.selectedTab);

    this.donutChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        datasets: [{
          data,
          backgroundColor: ['#1a2255', '#c5caee', '#2ec27e', '#e8eaf2'],
          borderWidth: 0,
          spacing: 3,
          borderRadius: 6,
        }]
      },
      options: {
        cutout: '72%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
      }
    });
  }

  private initBarChart(): void {
    const canvas = this.barChartRef?.nativeElement;
    if (!canvas) {
      return;
    }

    const { labels, spend, save } = this.getBarData(this.selectedTab);

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Spend',
            data: spend,
            backgroundColor: '#c5caee',
            borderRadius: 6,
          },
          {
            label: 'Save',
            data: save,
            backgroundColor: '#1a2255',
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#7b82a8', font: { size: 9 } },
          },
          y: { display: false }
        }
      }
    });
  }

  private updateCharts(): void {
    const lineData = this.getLineData(this.selectedTab);
    const donutData = this.getDonutData(this.selectedTab);
    const barData = this.getBarData(this.selectedTab);

    if (this.lineChart) {
      this.lineChart.data.labels = lineData.labels;
      this.lineChart.data.datasets[0].data = lineData.actual;
      this.lineChart.data.datasets[1].data = lineData.projected;
      this.lineChart.update();
    }

    if (this.donutChart) {
      this.donutChart.data.datasets[0].data = donutData;
      this.donutChart.update();
    }

    if (this.barChart) {
      this.barChart.data.labels = barData.labels;
      this.barChart.data.datasets[0].data = barData.spend;
      this.barChart.data.datasets[1].data = barData.save;
      this.barChart.update();
    }
  }

  trackByTab(index: number, tab: string): string {
    return tab;
  }

  optimizeBudget(): void {
    console.log('Optimize budget clicked');
    // Add real navigation or business logic here later.
  }

  private getLineData(period: string) {
    switch (period) {
      case 'Daily':
        return { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], actual: [22, 25, 24, 28, 30, 27, 29], projected: [null, null, null, null, null, 29, 31] };
      case 'Weekly':
        return { labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], actual: [120, 132, 125, 140, 150, 145, 155], projected: [null, null, null, null, null, 155, 162] };
      case 'Annual':
        return { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], actual: [420, 450, 470, 490, 520, 540, 560], projected: [null, null, null, null, null, 560, 585] };
      default:
        return { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], actual: [310, 320, 330, 345, 360, 380, 395, 410, 425, 440, 455, 470], projected: [null, null, null, null, null, null, 395, 410, 425, 440, 455, 470] };
    }
  }

  private getDonutData(period: string) {
    switch (period) {
      case 'Daily': return [40, 30, 20, 10];
      case 'Weekly': return [42, 28, 18, 12];
      case 'Annual': return [48, 24, 15, 13];
      default: return [45, 25, 15, 15];
    }
  }

  private getBarData(period: string) {
    switch (period) {
      case 'Daily':
        return { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], spend: [40, 35, 45, 30, 50, 48], save: [20, 25, 18, 28, 30, 35] };
      case 'Weekly':
        return { labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'], spend: [280, 320, 300, 340, 360, 380], save: [160, 180, 170, 190, 210, 230] };
      case 'Annual':
        return { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], spend: [420, 450, 470, 490, 520, 540], save: [260, 280, 300, 320, 340, 360] };
      default:
        return { labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], spend: [60, 45, 70, 50, 65, 30], save: [30, 55, 40, 60, 80, 90] };
    }
  }



  gotoAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  gotoGoals(): void {
    this.router.navigate(['/goals']);
  }
  gotoProfile(): void {
    this.router.navigate(['/profile']);
  }

  gotoDashboard(): void {
    this.router.navigate(['/dashboard'])
  }

  openScanner(): void {
    this.router.navigate(['/transaction']);
    console.log('Initiating QR Scanner...');
  }

 
}