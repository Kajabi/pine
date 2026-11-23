const MEMBERS = [
  { kind: 'props', key: 'name', noun: 'prop' },
  { kind: 'events', key: 'event', noun: 'event' },
  { kind: 'methods', key: 'name', noun: 'method' },
];

const isExempt = (member) => member.deprecation !== undefined || member.docsTags.some((tag) => tag.name === 'internal' || tag.name === 'deprecated');

export default {
  id: 'missing-description',
  scope: 'component',
  check({ tag, docs, source }) {
    return MEMBERS.flatMap(({ kind, key, noun }) =>
      docs[kind]
        .filter((member) => member.docs.trim() === '' && !isExempt(member))
        .map((member) => ({
          line: source.members[kind].get(member[key]) ?? source.componentLine,
          message: `${tag}'s ${member[key]} ${noun} has no JSDoc description.`,
          hint: `Describe it in a JSDoc comment above it. If another component has a similar ${noun}, match its wording.`,
        })),
    );
  },
};
