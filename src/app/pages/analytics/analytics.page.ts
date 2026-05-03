import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AnalyticsPage implements OnInit, AfterViewInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef;
  @ViewChild('donutChart') donutChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;

  tabs = ['Daily', 'Weekly', 'Monthly', 'Annual'];
  selectedTab = 'Monthly';

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initLineChart();
    this.initDonutChart();
    this.initBarChart();
  }

  setTab(tab: string) {
    this.selectedTab = tab;
    // Logic to update charts based on period would go here
  }

  initLineChart() {
    const ctx = this.lineChartRef.nativeElement.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 140);
    gradient.addColorStop(0, 'rgba(59,79,216,.18)');
    gradient.addColorStop(1, 'rgba(59,79,216,0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(18).fill(''),
        datasets: [
          {
            data: [30, 28, 32, 29, 33, 31, 35, 38, 36, 42, 40, 45, 48, 50, 52, 55, 58, 62],
            borderColor: '#1a2255',
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.45,
            fill: true,
            backgroundColor: gradient,
          },
          {
            data: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,52,55,58,62],
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

  initDonutChart() {
    new Chart(this.donutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [45, 25, 15, 15],
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

  initBarChart() {
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        datasets: [
          {
            label: 'Spend',
            data: [60, 45, 70, 50, 65, 30],
            backgroundColor: '#c5caee',
            borderRadius: 6,
          },
          {
            label: 'Save',
            data: [30, 55, 40, 60, 80, 90],
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
        },
        //barPercentage: 0.65,
        //categoryPercentage: 0.75,
      }
    });
  }
}