import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle: string;
  description: string;
}

export default function SlideSectionDivider({ title, subtitle, description }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 max-w-lg"
      >
        <p className="text-sm text-primary font-semibold tracking-wider uppercase">{subtitle}</p>
        <h2 className="text-3xl sm:text-4xl font-normal leading-tight">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </motion.div>
    </div>
  );
}
