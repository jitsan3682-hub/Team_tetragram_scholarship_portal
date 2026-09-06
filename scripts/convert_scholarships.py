import json
import os

input_path = 'ref_hackathon/HACKATHON/src/data/scholarshipsData.json'
output_path = 'src/data/allScholarships.json'

with open(input_path, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

transformed = []
for item in raw_data:
    title = item.get('title', '')
    title_lower = title.lower()
    provider = item.get('provider', 'Scholarship Authority')
    amount = item.get('amount', '₹25,000 / year')
    deadline = item.get('deadline', '2026-11-30')
    desc = item.get('description', '') or f"Official scholarship scheme offered by {provider} to support deserving candidates across India."

    # Categories
    categories = []
    if ' sc ' in f" {title_lower} " or 'scheduled caste' in title_lower:
        categories.append('SC')
    if ' st ' in f" {title_lower} " or 'scheduled tribe' in title_lower or 'tribal' in title_lower:
        categories.append('ST')
    if ' obc ' in f" {title_lower} " or 'backward class' in title_lower:
        categories.append('OBC')
    if 'minority' in title_lower or 'minorities' in title_lower:
        categories.append('Minority')
    if not categories:
        categories = ['General', 'OBC', 'SC', 'ST', 'EWS']

    # Genders
    genders = ['All']
    if 'girl' in title_lower or 'women' in title_lower or 'female' in title_lower or 'pragati' in title_lower or 'beti' in title_lower:
        genders = ['Female']

    # CAPF
    requires_capf = 'capf' in title_lower or 'assam rifles' in title_lower or 'police' in title_lower

    # Award type
    award_type = 'Merit Award'
    if 'tuition' in amount.lower() or 'waiver' in title_lower:
        award_type = 'Tuition Waiver'
    elif 'month' in amount.lower() or 'stipend' in amount.lower() or 'maintenance' in amount.lower():
        award_type = 'Living Stipend'
    elif 'full' in title_lower or 'full-ride' in title_lower:
        award_type = 'Full-Ride'

    # Academic levels
    levels = ['Undergraduate']
    if 'post matric' in title_lower or 'higher secondary' in title_lower or 'school' in title_lower:
        levels = ['School', 'Undergraduate']
    elif 'research' in title_lower or 'phd' in title_lower or 'doctoral' in title_lower:
        levels = ['Postgraduate', 'Doctoral']
    elif 'postgraduate' in title_lower or 'pg ' in title_lower or 'master' in title_lower:
        levels = ['Postgraduate']
    elif 'diploma' in title_lower or 'polytechnic' in title_lower:
        levels = ['Diploma', 'Undergraduate']
    else:
        levels = ['Undergraduate', 'Postgraduate']

    crit = item.get('criteria', {})
    min_gpa = crit.get('min_gpa')
    min_gpa = 2.5 if min_gpa is None else float(min_gpa)

    max_inc = crit.get('max_income')
    max_inc = 500000 if max_inc is None else int(max_inc)

    states = crit.get('eligible_states', ['All'])
    if not states:
        states = ['All']

    majors = crit.get('allowed_majors', ['All'])
    if not majors:
        majors = ['All']

    transformed.append({
        'id': item.get('id', f"sch_{len(transformed)}"),
        'title': title,
        'provider': provider,
        'status': 'Ongoing',
        'deadline': deadline,
        'amount': amount,
        'awardType': award_type,
        'academicLevels': levels,
        'description': desc,
        'eligibility': {
            'minGpa': min_gpa,
            'maxIncome': max_inc,
            'states': states,
            'majors': majors,
            'categories': categories,
            'genders': genders,
            'requiresCAPF': requires_capf,
        },
        'awardBreakdown': {
            'tuition': 'Tuition assistance covered' if ('tuition' in amount.lower() or 'fee' in amount.lower()) else False,
            'accommodation': 'Hostel / maintenance support' if ('hostel' in amount.lower() or 'maintenance' in amount.lower()) else False,
            'travel': False,
            'booksOrStipend': amount,
        },
        'docsNeeded': item.get('required_docs', ['Aadhaar Card', 'Income Certificate', 'Class 12 Marksheet', 'Bank Passbook']),
        'link': item.get('original_link', 'https://scholarships.gov.in'),
        'isVerified': True,
    })

os.makedirs('src/data', exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(transformed, f, ensure_ascii=False, indent=2)

print(f"Successfully converted and saved {len(transformed)} scholarships to {output_path}")
