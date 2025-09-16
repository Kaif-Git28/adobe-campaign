import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements AfterViewInit {
  // Mapping of each radio value to points (0,1,2,3)
  private scoreMapping: { [value: string]: number } = {
    // Q1 - Analytics Decision Making
    live_performance: 3,
    data_slow_decisions: 2,
    analytics_not_trusted: 1,
    unsure_data: 0,

    // Q2 - Re-targeting Drop-offs
    realtime_reengage: 3,
    email_segments: 2,
    no_structured_retargeting: 1,
    q2_not_sure: 0, // Made unique

    // Q3 - Campaign Launch Independence
    very_easy_templates: 3,
    manageable_small_updates: 2,
    difficult_dev_needed: 1,
    q3_not_sure: 0, // Made unique

    // Q4 - Campaign Asset Performance
    measure_regularly: 3,
    topline_results: 2,
    limited_segmentation: 1,
    q4_not_applicable: 0, // Made unique

    // Q5 - Commerce Experience Scalability
    flexible_fast_updated: 3,
    mostly_some_friction: 2,
    need_modernization: 1,
    q5_not_applicable: 0, // Made unique

    // Q6 - Customer Acquisition Costs
    track_optimize_regularly: 3,
    track_dont_optimize: 2,
    cac_rising_unclear: 1,
    not_tracked: 0,

    // Q7 - Cross-Channel Experience
    coordinated_journeys: 3,
    partially_synced: 2,
    experiences_vary: 1,
    q7_not_sure: 0, // Made unique
  };

  // names of required questions in the DOM
  private requiredQuestions = [
    'question1',
    'question2',
    'question3',
    'question4',
    'question5',
    'question6',
    'question7',
  ];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Set up character count for the optional textarea
    const textarea = document.getElementById(
      'business_challenge'
    ) as HTMLTextAreaElement | null;
    const countTextEl = document.querySelector(
      '.count-text'
    ) as HTMLElement | null;

    if (textarea && countTextEl) {
      const updateCount = () => {
        const len = textarea.value.length;
        countTextEl.textContent = `${len}/500`;
        countTextEl.classList.remove('near-limit', 'at-limit');

        if (len >= 450 && len < 500) {
          countTextEl.classList.add('near-limit');
        } else if (len >= 500) {
          countTextEl.classList.add('at-limit');
        }
      };

      textarea.addEventListener('input', updateCount);
      updateCount();
    }

    // Set up modal close functionality
    this.setupModalEvents();
  }

  // Add this new method
  private setupModalEvents(): void {
    const modalOverlay = document.getElementById('incompleteModal');
    const closeButton = document.getElementById('closeModal');

    if (closeButton && modalOverlay) {
      closeButton.addEventListener('click', () => {
        this.hideModal();
      });

      // Close modal when clicking outside
      modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
          this.hideModal();
        }
      });

      // Close modal with Escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('show')) {
          this.hideModal();
        }
      });
    }
  }

  // Add this new method
  private showModal(): void {
    const modal = document.getElementById('incompleteModal');
    if (modal) {
      modal.style.display = 'flex';
      // Small delay to ensure display is applied before adding show class
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
    }
  }

  // Add this new method
  private hideModal(): void {
    const modal = document.getElementById('incompleteModal');
    if (modal) {
      modal.classList.remove('show');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }

  // returns selected radio value for question name, or null
  private getSelectedValue(questionName: string): string | null {
    const sel = document.querySelector(
      `input[name="${questionName}"]:checked`
    ) as HTMLInputElement | null;
    return sel ? sel.value : null;
  }

  // compute score across required questions; if any required unanswered -> valid=false
  private computeScore(): {
    valid: boolean;
    score: number;
    answers: Record<string, string>;
  } {
    let total = 0;
    const answers: Record<string, string> = {};

    for (const q of this.requiredQuestions) {
      const val = this.getSelectedValue(q);
      if (!val) {
        return { valid: false, score: 0, answers };
      }
      answers[q] = val;
      const pts = this.scoreMapping[val];
      total += typeof pts === 'number' ? pts : 0;
    }

    return { valid: true, score: total, answers };
  }

  private getStage(score: number): string {
    if (score <= 7) return 'Platform Holder';
    if (score <= 13) return 'Optimizer';
    if (score <= 17) return 'Orchestrator';
    return 'Experience Leader';
  }

  // Called by the HTML button (click)
  onSubmit(): void {
    const result = this.computeScore();

    if (!result.valid) {
      this.showModal();
      return;
    }

    const totalScore = result.score;
    const maxScore = 7 * 3; // 21 - Updated for Adobe assessment
    const percentage = Math.round((totalScore / maxScore) * 100);
    const stage = this.getStage(totalScore);

    const businessChallenge = (document.getElementById('business_challenge') as HTMLTextAreaElement | null)?.value || '';

    console.log(totalScore);
    this.router.navigate(['/results'], {
      state: {
        totalScore,
        maxScore,
        percentage,
        stage,
        answers: result.answers,
        businessChallenge
      }
    });
  }
}