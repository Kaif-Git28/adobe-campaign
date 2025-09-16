import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrls: ['./result.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class Result implements OnInit {
  // values coming from navigation state (Home component)
  totalScore: number = 0;
  maxScore: number = 42; // 7 questions * 6 points
  percentage: number = 0; // rounded percent
  stageLabel: string = '';
  stageMessage: string = '';
  statusLabel: 'PASS' | 'FAIL' = 'FAIL';
  radialBackground: string = ''; // will contain conic-gradient string
  businessChallenge: string = '';

  // pills shown on the card (visual)
  pills: Array<{ text: string; class?: string }> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Read passed state (Home navigated with router.navigate(['/results'], { state: {...} }))
    const st = history && history.state ? history.state : {};

    // Use values directly from home.ts - no recalculation needed
    this.totalScore = Number(st.totalScore ?? 0);
    this.maxScore = Number(st.maxScore ?? 42);
    this.percentage =
      st.percentage ?? Math.round((this.totalScore / this.maxScore) * 100);
    this.businessChallenge = st.businessChallenge ?? '';
    this.stageLabel = st.stage ?? this.mapStageLabel(this.totalScore);

    // set stage message using the stageLabel
    this.stageMessage = this.mapStageMessage(this.stageLabel);

    // status: treat Growth and Industry Leader as PASS; others as FAIL
    this.statusLabel =
      this.stageLabel === 'Growth Stage' ||
      this.stageLabel === 'Industry Leader Stage'
        ? 'PASS'
        : 'FAIL';

    // build pills based on stage (visual guidance)
    this.buildPills(this.stageLabel);

    // compute radial background (conic-gradient string)
    this.radialBackground = this.makeRadialBackground(this.percentage);
  }

  private mapStageLabel(score: number): string {
    if (score <= 7) return 'Platform Holder';
    if (score <= 13) return 'Optimizer';
    if (score <= 17) return 'Orchestrator';
    return 'Experience Leader';
  }

  // set the detailed stage message based on stage label
  private mapStageMessage(stage: string): string {
    switch (stage) {
      case 'Platform Holder':
        return "Your Adobe stack is set up, but it's underutilized. You're likely experiencing operational friction, low personalization ROI, and long campaign timelines.";
      case 'Optimizer':
        return "You've got solid foundations. Some tools and processes are working well, but there's untapped potential in cross-team alignment, signal loops, and automation.";
      case 'Orchestrator':
        return "Your experience stack is integrated and performing well. You're likely seeing value, but can still improve scale, speed, or cost-efficiency.";
      case 'Experience Leader':
        return "You're in the top tier. Your Adobe investment is driving measurable growth, fast iteration, and smart personalization. Now it's about staying ahead.";
      default:
        return 'Assessment complete. Review your results and next steps.';
    }
  }

  // Updated pills for Adobe assessment stages
private buildPills(stage: string) {
  if (stage === 'Platform Holder') {
    this.pills = [
      { text: 'Platform Setup', class: 'pill-ghost' },
      { text: 'Underutilized', class: '' },
      { text: 'Need Activation', class: '' }
    ];
  } else if (stage === 'Optimizer') {
    this.pills = [
      { text: 'Solid Foundation', class: 'pill-secondary' },
      { text: 'Automation Gaps', class: '' },
      { text: 'Alignment Needed', class: '' }
    ];
  } else if (stage === 'Orchestrator') {
    this.pills = [
      { text: 'Integrated Stack', class: 'pill-success' },
      { text: 'Scale Focus', class: '' },
      { text: 'Speed & Efficiency', class: '' }
    ];
  } else {
    this.pills = [
      { text: 'Experience Leader', class: 'pill-success' },
      { text: 'Fast Iteration', class: '' },
      { text: 'Smart Personalization', class: '' }
    ];
  }
}

  // produces the conic-gradient background CSS for the given percent (0..100)
  private makeRadialBackground(percent: number): string {
    // clamp
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    const angle = (p / 100) * 360;

    // Use green for non-At Risk stages, red for At Risk stage
    const isAtRisk = this.stageLabel === 'Platform Holder';
    const accent = isAtRisk ? '#d82828' : '#28a745'; // red for At Risk, green for others
    const accentLight = isAtRisk ? '#ffd7d7' : '#d4edda'; // light red for At Risk, light green for others

    return `conic-gradient(${accent} 0deg, ${accent} ${angle}deg, ${accentLight} ${angle}deg, ${accentLight} 360deg)`;
  }

  // nav actions
  contactExperts() {
    // send to contact or open contact form — placeholder for your integration
    console.log('contactExperts clicked');
    // example: this.router.navigate(['/contact']);
  }

  toggleMenu() {
    // kept for parity with header
    console.log('menu toggled');
  }
}
