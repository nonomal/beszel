import { UserAuthForm } from '@/components/login/auth-form'
import { Logo } from '../logo'
import { useEffect, useMemo, useState } from 'react'
import { pb } from '@/lib/stores'
import { useStore } from '@nanostores/react'
import ForgotPassword from './forgot-pass-form'
import { $router } from '../router'
import { AuthMethodsList } from 'pocketbase'

export default function () {
	const page = useStore($router)
	const [isFirstRun, setFirstRun] = useState(false)
	const [authMethods, setAuthMethods] = useState<AuthMethodsList>()

	useEffect(() => {
		document.title = 'Login / Beszel'

		pb.send('/api/beszel/first-run', {}).then(({ firstRun }) => {
			setFirstRun(firstRun)
		})
	}, [])

	useEffect(() => {
		pb.collection('users')
			.listAuthMethods()
			.then((methods) => {
				setAuthMethods(methods)
			})
	}, [])

	const subtitle = useMemo(() => {
		if (isFirstRun) {
			return 'Please create an admin account'
		} else if (page?.path === '/forgot-password') {
			return 'Enter email address to reset password'
		} else {
			return 'Please sign in to your account'
		}
	}, [isFirstRun, page])

	if (!authMethods) {
		return null
	}

	return (
		<div className="min-h-screen grid items-center py-12">
			<div className="grid gap-5 w-full px-4 mx-auto" style={{ maxWidth: '22em' }}>
				<div className="text-center">
					<h1 className="mb-3">
						<Logo className="h-7 fill-foreground mx-auto" />
						<span className="sr-only">Beszel</span>
					</h1>
					<p className="text-sm text-muted-foreground">{subtitle}</p>
				</div>
				{page?.path === '/forgot-password' ? (
					<ForgotPassword />
				) : (
					<UserAuthForm isFirstRun={isFirstRun} authMethods={authMethods} />
				)}
			</div>
		</div>
	)
}
