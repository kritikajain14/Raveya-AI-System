export const categoryPrompt = (productData) => {
  const predefinedCategories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
    'Toys', 'Automotive', 'Health & Beauty', 'Food & Beverage', 'Office Supplies'
  ];

  const sustainabilityFilters = [
    'Biodegradable', 'Recyclable', 'Plastic-free', 'Organic', 'Fair Trade',
    'Energy Efficient', 'Water Saving', 'Carbon Neutral', 'Locally Sourced',
    'Cruelty-free', 'Vegan', 'Sustainable Materials', 'Minimal Packaging'
  ];

  return `
You are a strict JSON generator.

Analyze the following product:

Name: ${productData.name}
Description: ${productData.description}

Rules:
1. Select exactly ONE primaryCategory from this list:
${predefinedCategories.join(', ')}

2. Suggest one specific subcategory.

3. Generate 5-10 SEO optimized tags (array of strings).

4. Select 2-5 sustainabilityFilters from this list:
${sustainabilityFilters.join(', ')}

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT include explanation.
- Do NOT include markdown.
- Do NOT include backticks.
- Do NOT write anything before or after JSON.
- Ensure tags and sustainabilityFilters are arrays.

Output format example:
{
  "primaryCategory": "Electronics",
  "subcategory": "Smart Gadgets",
  "tags": ["smart bottle", "hydration tracker"],
  "sustainabilityFilters": ["Reusable", "Energy Efficient"]
}
`;
};

export const proposalPrompt = (proposalData, availableProducts) => {
  return `
You are a strict JSON generator.

Client Name: ${proposalData.clientName}
Budget: ${proposalData.budget}

Available Products:
${availableProducts.map(p => `
ID: ${p._id}
Name: ${p.name}
Price: ${p.basePrice}
Sustainability: ${p.sustainabilityFilters?.join(', ') || 'None'}
Category: ${p.category}
Stock: ${p.stockQuantity}
`).join('\n')}

Rules:
- Total cost must NOT exceed budget.
- Consider stock limits.
- Prioritize products with sustainability filters.
- Include product ID in output.
- Include quantity and unitCost.
- quantity must be <= stock.

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT include explanation.
- Do NOT include markdown.
- Do NOT include backticks.
- Do NOT include text before or after JSON.

Return EXACTLY this format:

{
  "products": [
    {
      "id": "string",
      "quantity": number,
      "unitCost": number
    }
  ],
  "impact_summary": {
    "total_sustainable_products": number,
    "estimated_carbon_reduction": "string",
    "sustainability_score": number,
    "highlights": ["string"]
  }
}
`;
};