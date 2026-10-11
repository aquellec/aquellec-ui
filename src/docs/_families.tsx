import { useState } from 'react';
import { Briefcase, Check, FileText, Sparkles, X } from 'lucide-react';
import { useI18n, type Dictionary } from '../../.storybook/i18n';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataTable } from '../components/DataTable';
import { Dropzone } from '../components/Dropzone';
import { Input } from '../components/Input';
import { ProgressBar } from '../components/ProgressBar';
import { ScoreGauge } from '../components/ScoreGauge';
import { SegmentedControl } from '../components/SegmentedControl';
import { Textarea } from '../components/Textarea';
import { Toast } from '../components/Toast';
import { cn } from '../lib/cn';
import { getScoreTextClass } from '../lib/score-tier';
import {
  dividerBorderClass,
  mutedTextClass,
  strongTextClass,
  subtleTextClass,
  surfaceBorderClass,
} from '../lib/semantic-colors';
import { PageCover, cardSurface, displayClass, eyebrowClass } from './_showcase';

/*
  Overview page shared by every component family: a cover, usage guidance, a
  live specimen and the main states. Specimens are written per family to show
  components in composition, with realistic sample data.
*/

export type FamilyKey = keyof Dictionary['docs']['overviews']['families'];

/* -------------------------------------------------------------------------- */
/*  Page furniture                                                             */
/* -------------------------------------------------------------------------- */

export function FamilyCover({ family }: { family: FamilyKey }) {
  const t = useI18n().docs.overviews.families[family];

  return (
    <PageCover
      kicker={t.kicker}
      title={t.title}
      description={t.description}
      facts={t.facts}
      ramp={family === 'dataDisplay' ? 'ai' : 'brand'}
    />
  );
}

function OverviewHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className={cn('sb-unstyled mb-5 mt-14 text-2xl md:text-3xl', displayClass, strongTextClass)}
    >
      {children}
    </h2>
  );
}

/** Caption under a live specimen. */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className={cn('sb-unstyled mt-3 max-w-measure text-sm leading-relaxed', mutedTextClass)}>
      {children}
    </p>
  );
}

/** The frame every live example sits in, so specimens read as specimens. */
function Specimen({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'sb-unstyled overflow-hidden rounded-2xl border bg-ink-50 p-6 dark:bg-ink-900',
        surfaceBorderClass,
        className
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Judgement: when to use, when not to                                        */
/* -------------------------------------------------------------------------- */

/** Usage guidance: when to use the family and when to choose something else. */
export function FamilyGuidance({ family }: { family: FamilyKey }) {
  const overviews = useI18n().docs.overviews;
  const t = overviews.families[family];

  return (
    <>
      <OverviewHeading id="when-to-use">{overviews.labels.guidance}</OverviewHeading>
      <div className="sb-unstyled grid gap-4 md:grid-cols-2">
        <section
          className="rounded-xl bg-moss-100 p-5 dark:bg-moss-500/20"
        >
          <p className={cn('mb-3 text-moss-800 dark:text-moss-200', eyebrowClass)}>
            {overviews.labels.use}
          </p>
          <ul className="flex list-none flex-col gap-2.5 p-0">
            {t.use.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm leading-relaxed text-moss-900 dark:text-moss-100"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-xl bg-brick-100 p-5 dark:bg-brick-500/20"
        >
          <p className={cn('mb-3 text-brick-800 dark:text-brick-200', eyebrowClass)}>
            {overviews.labels.avoid}
          </p>
          <ul className="flex list-none flex-col gap-2.5 p-0">
            {t.avoid.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm leading-relaxed text-brick-900 dark:text-brick-100"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

/** One-sentence note on how the family uses rules and ticks. */
export function FamilyMark({ family }: { family: FamilyKey }) {
  const overviews = useI18n().docs.overviews;

  return (
    <p
      className={cn(
        'sb-unstyled my-8 max-w-measure rounded-xl bg-ink-50 p-5 text-base leading-relaxed dark:bg-ink-800',
        subtleTextClass
      )}
    >
      <span className={cn('mr-2 text-brand-700 dark:text-brand-300', eyebrowClass)}>
        {overviews.labels.mark}
      </span>
      {overviews.families[family].mark}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Sample data shared by the specimens */
/* -------------------------------------------------------------------------- */

interface Applicant {
  id: string;
  name: string;
  role: string;
  score: number;
  received: string;
  status: 'matched' | 'review' | 'rejected';
}

const statusVariant = { matched: 'success', review: 'warning', rejected: 'danger' } as const;

/**
 * Sample records shared by every specimen, so the same entry appears in several
 * components. Values straddle both tier boundaries (88, 61, 43) so every
 * threshold is exercised.
 */
const shortlist: Applicant[] = [
  { id: 'a1', name: 'Salomé Berthier', role: 'Senior Front-End Engineer', score: 88, received: '2026-08-24', status: 'matched' },
  { id: 'a2', name: 'Mehdi Ouazzani', role: 'Senior Front-End Engineer', score: 61, received: '2026-08-23', status: 'review' },
  { id: 'a3', name: 'Théo Vasseur', role: 'Senior Front-End Engineer', score: 43, received: '2026-08-21', status: 'rejected' },
];

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export function ActionsSpecimen() {
  const t = useI18n().docs.overviews;
  const [stage, setStage] = useState('screening');

  return (
    <>
      <OverviewHeading id="in-composition">{t.labels.anatomy}</OverviewHeading>
      <Specimen>
        <div className="flex flex-col gap-5">
          <SegmentedControl
            value={stage}
            onChange={setStage}
            ariaLabel={t.specimens.actions.stageLabel}
            options={[
              { value: 'screening', label: t.specimens.actions.screening },
              { value: 'interview', label: t.specimens.actions.interview },
              { value: 'offer', label: t.specimens.actions.offer },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ai">{t.specimens.actions.runAnalysis}</Button>
            <Button variant="primary">{t.specimens.actions.advance}</Button>
            <Button variant="outline">{t.specimens.actions.requestReferences}</Button>
            <Button variant="ghost">{t.specimens.actions.archive}</Button>
          </div>
        </div>
      </Specimen>
      <Caption>{t.specimens.actions.caption}</Caption>
    </>
  );
}

export function FormsSpecimen() {
  const t = useI18n().docs.overviews;
  const dict = useI18n();

  return (
    <>
      <OverviewHeading id="in-composition">{t.labels.anatomy}</OverviewHeading>
      <Specimen>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label={t.specimens.forms.roleLabel}
            defaultValue="Senior Front-End Engineer"
            helperText={t.specimens.forms.roleHelper}
          />
          <Input
            label={t.specimens.forms.emailLabel}
            defaultValue="salome.berthier@"
            error={t.specimens.forms.emailError}
          />
          <div className="md:col-span-2">
            <Textarea
              label={t.specimens.forms.jobLabel}
              rows={3}
              maxLength={400}
              defaultValue={t.specimens.forms.jobValue}
              helperText={t.specimens.forms.jobHelper}
            />
          </div>
          <div className="md:col-span-2">
            <Dropzone labels={dict.components.dropzone} maxSizeMB={5} accept=".pdf" />
          </div>
        </div>
      </Specimen>
      <Caption>{t.specimens.forms.caption}</Caption>
    </>
  );
}

export function FeedbackSpecimen() {
  const t = useI18n().docs.overviews;

  return (
    <>
      <OverviewHeading id="in-composition">{t.labels.anatomy}</OverviewHeading>
      <Specimen>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" icon="check">
              {t.specimens.feedback.matched}
            </Badge>
            <Badge variant="warning" icon="warning">
              {t.specimens.feedback.review}
            </Badge>
            <Badge variant="danger" icon="cross">
              {t.specimens.feedback.rejected}
            </Badge>
            <Badge variant="ai" icon="ai">
              {t.specimens.feedback.parsed}
            </Badge>
            <Badge variant="neutral">{t.specimens.feedback.draft}</Badge>
          </div>
          <Toast
            variant="ai"
            title={t.specimens.feedback.toastTitle}
            description={t.specimens.feedback.toastBody}
          />
          <Toast
            variant="error"
            title={t.specimens.feedback.errorTitle}
            description={t.specimens.feedback.errorBody}
          />
        </div>
      </Specimen>
      <Caption>{t.specimens.feedback.caption}</Caption>
    </>
  );
}

export function DataDisplaySpecimen() {
  const dict = useI18n();
  const t = dict.docs.overviews;

  return (
    <>
      <OverviewHeading id="in-composition">{t.labels.anatomy}</OverviewHeading>
      <Specimen>
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start gap-5">
            {shortlist.map((applicant) => (
              <ScoreGauge
                key={applicant.id}
                score={applicant.score}
                size="sm"
                label={applicant.name.split(' ')[0]}
                statusLabels={dict.components.gaugeStatus}
              />
            ))}
          </div>

          <ProgressBar
            value={41}
            max={50}
            label={t.specimens.dataDisplay.quotaLabel}
            helperText={t.specimens.dataDisplay.quotaHelper}
          />

          <DataTable
            data={shortlist}
            keyExtractor={(item) => item.id}
            labels={dict.components.dataTable}
            columns={[
              {
                header: t.specimens.dataDisplay.columns.candidate,
                cell: (item) => (
                  <span className={cn('font-medium', strongTextClass)}>{item.name}</span>
                ),
              },
              {
                header: t.specimens.dataDisplay.columns.score,
                cell: (item) => (
                  <span className={cn('font-semibold tabular-nums', getScoreTextClass(item.score))}>
                    {item.score}%
                  </span>
                ),
              },
              {
                header: t.specimens.dataDisplay.columns.status,
                cell: (item) => (
                  <Badge variant={statusVariant[item.status]} size="sm">
                    {t.specimens.dataDisplay.statuses[item.status]}
                  </Badge>
                ),
              },
              {
                header: t.specimens.dataDisplay.columns.received,
                accessorKey: 'received',
              },
            ]}
          />
        </div>
      </Specimen>
      <Caption>{t.specimens.dataDisplay.caption}</Caption>
    </>
  );
}

export function SurfacesSpecimen() {
  const t = useI18n().docs.overviews;

  return (
    <>
      <OverviewHeading id="in-composition">{t.labels.anatomy}</OverviewHeading>
      <Specimen>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Card.Header
              title={t.specimens.surfaces.applicationTitle}
              subtitle={t.specimens.surfaces.applicationSubtitle}
              action={
                <Badge variant="success" icon="check" size="sm">
                  {t.specimens.surfaces.matched}
                </Badge>
              }
            />
            <Card.Body>
              <p className={cn('text-sm leading-relaxed', subtleTextClass)}>
                {t.specimens.surfaces.applicationBody}
              </p>
            </Card.Body>
            <Card.Footer>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                {t.specimens.surfaces.applicationMeta}
              </span>
              <Button variant="ghost" size="sm">
                {t.specimens.surfaces.openReport}
              </Button>
            </Card.Footer>
          </Card>

          <Card variant="ai">
            <Card.Header
              title={t.specimens.surfaces.aiTitle}
              subtitle={t.specimens.surfaces.aiSubtitle}
              action={
                <Badge variant="ai" icon="ai" size="sm">
                  {t.specimens.surfaces.aiBadge}
                </Badge>
              }
            />
            <Card.Body>
              <p className={cn('text-sm leading-relaxed', subtleTextClass)}>
                {t.specimens.surfaces.aiBody}
              </p>
            </Card.Body>
            <Card.Footer>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t.specimens.surfaces.aiMeta}
              </span>
            </Card.Footer>
          </Card>
        </div>
      </Specimen>
      <Caption>{t.specimens.surfaces.caption}</Caption>
    </>
  );
}

export function TemplatesSpecimen() {
  const t = useI18n().docs.overviews;

  return (
    <>
      <OverviewHeading id="in-composition">{t.labels.anatomy}</OverviewHeading>
      <div className="sb-unstyled grid gap-4 md:grid-cols-2">
        {t.specimens.templates.pages.map((page) => (
          <a
            key={page.label}
            href={page.href}
            target="_top"
            className={cn(
              'flex flex-col gap-2 p-5 no-underline transition-colors duration-150 ease-settle motion-reduce:transition-none',
              cardSurface,
              'hover:border-brand-600/40 dark:hover:border-brand-400/40'
            )}
          >
            <span
              className={cn('inline-flex items-center gap-2 text-brand-700 dark:text-brand-300', eyebrowClass)}
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {page.kicker}
            </span>
            <span className={cn('text-lg font-semibold', strongTextClass)}>{page.label}</span>
            <span className={cn('text-sm leading-relaxed', subtleTextClass)}>{page.body}</span>
          </a>
        ))}
      </div>
      <Caption>{t.specimens.templates.caption}</Caption>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  States                                                                     */
/* -------------------------------------------------------------------------- */

/** Empty, error and limit states for each family. */
export function FamilyStates({ family }: { family: FamilyKey }) {
  const dict = useI18n();
  const t = dict.docs.overviews;
  const copy = t.families[family].states;

  const panels: Record<FamilyKey, React.ReactNode> = {
    actions: (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ai" isLoading>
          {t.states.analysing}
        </Button>
        <Button variant="primary" disabled>
          {t.states.quotaSpent}
        </Button>
      </div>
    ),
    forms: (
      <div className="flex flex-col gap-4">
        <Dropzone labels={dict.components.dropzone} isLoading />
        <Input
          label={t.specimens.forms.emailLabel}
          defaultValue="salome.berthier@"
          error={t.specimens.forms.emailError}
        />
      </div>
    ),
    feedback: (
      <div className="flex flex-col gap-3">
        <Toast
          variant="success"
          title={t.states.importedTitle}
          description={t.states.importedBody}
        />
        <Toast
          variant="warning"
          title={t.states.quotaTitle}
          description={t.states.quotaBody}
        />
      </div>
    ),
    dataDisplay: (
      <div className="flex flex-col gap-4">
        <DataTable
          data={[]}
          keyExtractor={(item: Applicant) => item.id}
          labels={dict.components.dataTable}
          emptyMessage={t.states.noApplicants}
          columns={[
            { header: t.specimens.dataDisplay.columns.candidate },
            { header: t.specimens.dataDisplay.columns.score },
            { header: t.specimens.dataDisplay.columns.status },
          ]}
        />
        <DataTable
          data={[]}
          keyExtractor={(item: Applicant) => item.id}
          labels={dict.components.dataTable}
          isLoading
          columns={[
            { header: t.specimens.dataDisplay.columns.candidate },
            { header: t.specimens.dataDisplay.columns.score },
            { header: t.specimens.dataDisplay.columns.status },
          ]}
        />
      </div>
    ),
    surfaces: (
      <div className="grid gap-4 md:grid-cols-2">
        <Card variant="ghost">
          <Card.Header title={t.states.emptyPipelineTitle} />
          <Card.Body>
            <p className={cn('text-sm leading-relaxed', subtleTextClass)}>
              {t.states.emptyPipelineBody}
            </p>
          </Card.Body>
          <Card.Footer>
            <span />
            <Button variant="primary" size="sm">
              {t.states.emptyPipelineAction}
            </Button>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Header
            title={t.states.parseFailedTitle}
            action={
              <Badge variant="danger" icon="cross" size="sm">
                {t.states.parseFailedBadge}
              </Badge>
            }
          />
          <Card.Body>
            <p className={cn('text-sm leading-relaxed', subtleTextClass)}>
              {t.states.parseFailedBody}
            </p>
          </Card.Body>
        </Card>
      </div>
    ),
    templates: (
      <ProgressBar
        value={50}
        max={50}
        label={t.specimens.dataDisplay.quotaLabel}
        helperText={t.states.quotaBody}
        action={
          <Button variant="ai" size="sm">
            {t.states.upgrade}
          </Button>
        }
      />
    ),
  };

  return (
    <>
      <OverviewHeading id="states">{t.labels.states}</OverviewHeading>
      <p className={cn('sb-unstyled mb-5 max-w-measure text-base leading-relaxed', subtleTextClass)}>
        {copy}
      </p>
      <Specimen>{panels[family]}</Specimen>
      <div className={cn('sb-unstyled mt-8 border-t pt-4', dividerBorderClass)} />
    </>
  );
}
