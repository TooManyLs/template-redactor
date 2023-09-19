import React from 'react';
import { render, screen } from '@testing-library/react';
import { extractValues } from './PreviewScreen';

describe('extractValues', () => {
  it('replaces variables with their values', () => {
    const arr: any = [
      { type: 'tarea', value: 'Hello {firstname},\n' },
      { type: 'ifelse', children: [
        { type: 'tarea', name: 'If', value: '{company}' },
        { type: 'tarea', name: 'Then', value: 'I know you work at {company}' },
        { type: 'tarea', name: 'Else', value: 'Where do you work at the moment?' }
      ]}
    ];
    const values = { firstname: 'John', company: 'Microsoft' };
    const result = extractValues(arr, values);
    expect(result).toBe('Hello John,\nI know you work at Microsoft');
  });

  it('handles missing values', () => {
    const arr: any = [
      { type: 'tarea', value: 'Hello {firstname},\n' },
      { type: 'ifelse', children: [
        { type: 'tarea', name: 'If', value: '{company}' },
        { type: 'tarea', name: 'Then', value: 'I know you work at {company}' },
        { type: 'tarea', name: 'Else', value: 'Where do you work at the moment?' }
      ]}
    ];
    const values = { firstname: 'John', company: '' };
    const result = extractValues(arr, values);
    expect(result).toBe('Hello John,\nWhere do you work at the moment?');
  });

  it('handles words in curly braces', () => {
    const arr: any = [
      { type: 'tarea', value: 'Hello {firstname},\n' },
      { type: 'ifelse', children: [
        { type: 'tarea', name: 'If', value: '{company}' },
        { type: 'tarea', name: 'Then', value: 'I know you work at {company}' },
        { type: 'tarea', name: 'Else', value: 'Where do you work at the moment?' }
      ]}
    ];
    const values = { firstname: 'John'};
    const result = extractValues(arr, values);
    expect(result).toBe('Hello John,\nI know you work at {company}');
  });
});