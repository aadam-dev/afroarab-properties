import { OpenAssistantButton } from "@/components/assistant/OpenAssistantButton";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { SalesContact } from "@/components/site/SalesContact";
import { FadeUp } from "@/components/ui/MaskedText";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export function HomeContact() {
  return (
    <Section id="contact" tone="muted" labelledBy="contact-title">
      <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title={
              <>
                Arrange a <em>viewing.</em>
              </>
            }
            lead={
              <>
                Tell us the estate or plot you&apos;re considering. Call, WhatsApp or send the form
                and the Accra sales team will reply. Want a quick answer first?{" "}
                <OpenAssistantButton className="font-semibold text-foreground" />.
              </>
            }
          />
          <FadeUp delay={0.1}>
            <SalesContact className="mt-10" compact />
          </FadeUp>
        </div>
        <FadeUp delay={0.05}>
          <EnquiryForm intent="viewing" />
        </FadeUp>
      </Container>
    </Section>
  );
}
