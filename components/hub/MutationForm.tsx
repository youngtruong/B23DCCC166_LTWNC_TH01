export function MutationForm({ operation, id, children, className = 'button' }: { operation: 'complete' | 'delete'; id: string; children: React.ReactNode; className?: string }) {
  return <form action="/api/deadlines" method="post"><input type="hidden" name="operation" value={operation} /><input type="hidden" name="id" value={id} /><button className={className}>{children}</button></form>;
}
